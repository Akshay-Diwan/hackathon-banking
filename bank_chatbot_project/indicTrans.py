import os
import sys
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import sentencepiece_model_pb2 as sp_model_pb2
from huggingface_hub import snapshot_download
import warnings
warnings.filterwarnings('ignore')

class IndicTrans:
    """
    Wrapper class for IndicTrans2 offline translation
    Supports translation between Indian languages and English
    """
    
    def __init__(self, model_name="ai4bharat/indictrans2-indic-en-1B", cache_dir="./models"):
        """
        Initialize the IndicTrans2 model
        
        Args:
            model_name: HuggingFace model name 
            cache_dir: Directory to cache the model files
        """
        self.model_name = model_name
        self.cache_dir = cache_dir
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        print(f"Initializing IndicTrans2 on device: {self.device}")
        
        # Create cache directory
        os.makedirs(cache_dir, exist_ok=True)
        
        # Language code mappings
        self.supported_languages = {
            # Indian languages to IndicTrans codes
            'hin_Deva': 'hi',  # Hindi
            'mar_Deva': 'mr',  # Marathi
            'guj_Gujr': 'gu',  # Gujarati
            'eng_Latn': 'en'   # English
        }
        
        # Initialize models and tokenizers
        self.models = {}
        self.tokenizers = {}
        
        # Load Indic to English model
        self._load_model("indic-en")
        
        # Load English to Indic model  
        self._load_model("en-indic")
        
        print("IndicTrans2 initialization complete")
    
    def _load_model(self, direction):
        """Load model and tokenizer for specific translation direction"""
        try:
            if direction == "indic-en":
                model_path = "ai4bharat/indictrans2-indic-en-1B"
            else:  # en-indic
                model_path = "ai4bharat/indictrans2-en-indic-1B"
            
            print(f"Loading {direction} model: {model_path}")
            
            # Download and cache model
            model_dir = snapshot_download(
                repo_id=model_path,
                cache_dir=self.cache_dir,
                force_download=False
            )
            
            # Load tokenizer
            tokenizer = AutoTokenizer.from_pretrained(
                model_dir,
                trust_remote_code=True,
                use_fast=False
            )
            
            # Load model
            model = AutoModelForSeq2SeqLM.from_pretrained(
                model_dir,
                trust_remote_code=True,
                torch_dtype=torch.float16 if self.device.type == 'cuda' else torch.float32
            )
            
            model.to(self.device)
            model.eval()
            
            self.models[direction] = model
            self.tokenizers[direction] = tokenizer
            
            print(f"Successfully loaded {direction} model")
            
        except Exception as e:
            print(f"Error loading {direction} model: {e}")
            raise e
    
    def _get_translation_direction(self, src_lang, tgt_lang):
        """Determine translation direction based on source and target languages"""
        if src_lang == 'eng_Latn' and tgt_lang != 'eng_Latn':
            return "en-indic"
        elif src_lang != 'eng_Latn' and tgt_lang == 'eng_Latn':
            return "indic-en"
        else:
            # For Indic to Indic translation, go through English
            return "pivot"
    
    def translate(self, text, src_lang, tgt_lang, max_length=512):
        """
        Translate text from source language to target language
        
        Args:
            text: Input text to translate
            src_lang: Source language code (e.g., 'hin_Deva')
            tgt_lang: Target language code (e.g., 'eng_Latn')
            max_length: Maximum sequence length
            
        Returns:
            Translated text
        """
        try:
            # Handle same language case
            if src_lang == tgt_lang:
                return text
            
            # Clean and preprocess text
            text = self._preprocess_text(text)
            if not text.strip():
                return text
            
            direction = self._get_translation_direction(src_lang, tgt_lang)
            
            if direction == "pivot":
                # Indic to Indic translation via English pivot
                return self._pivot_translate(text, src_lang, tgt_lang, max_length)
            else:
                # Direct translation
                return self._direct_translate(text, src_lang, tgt_lang, direction, max_length)
                
        except Exception as e:
            print(f"Translation error: {e}")
            return text  # Return original text on error
    
    def _direct_translate(self, text, src_lang, tgt_lang, direction, max_length):
        """Perform direct translation using appropriate model"""
        try:
            model = self.models[direction]
            tokenizer = self.tokenizers[direction]
            
            # Prepare input with language tokens
            if direction == "indic-en":
                input_text = f"{src_lang}: {text}"
            else:  # en-indic
                input_text = f"{tgt_lang}: {text}"
            
            # Tokenize
            inputs = tokenizer(
                input_text,
                return_tensors="pt",
                padding=True,
                truncation=True,
                max_length=max_length
            ).to(self.device)
            
            # Generate translation
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_length=max_length,
                    num_beams=4,
                    early_stopping=True,
                    do_sample=False
                )
            
            # Decode output
            translated = tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Clean up output
            translated = self._postprocess_text(translated)
            
            return translated
            
        except Exception as e:
            print(f"Direct translation error: {e}")
            return text
    
    def _pivot_translate(self, text, src_lang, tgt_lang, max_length):
        """Translate between two Indic languages using English as pivot"""
        try:
            # First translate to English
            english_text = self._direct_translate(text, src_lang, 'eng_Latn', "indic-en", max_length)
            
            # Then translate from English to target language
            final_text = self._direct_translate(english_text, 'eng_Latn', tgt_lang, "en-indic", max_length)
            
            return final_text
            
        except Exception as e:
            print(f"Pivot translation error: {e}")
            return text
    
    def _preprocess_text(self, text):
        """Preprocess text before translation"""
        # Remove extra whitespaces
        text = " ".join(text.split())
        
        # Handle empty or very short text
        if len(text.strip()) < 2:
            return text
        
        # Ensure text doesn't exceed reasonable length
        if len(text) > 1000:
            text = text[:1000] + "..."
        
        return text
    
    def _postprocess_text(self, text):
        """Postprocess translated text"""
        # Remove any language prefixes that might remain
        prefixes_to_remove = ['hin_Deva:', 'mar_Deva:', 'guj_Gujr:', 'eng_Latn:']
        for prefix in prefixes_to_remove:
            if text.startswith(prefix):
                text = text[len(prefix):].strip()
        
        # Clean up extra spaces
        text = " ".join(text.split())
        
        return text
    
    def batch_translate(self, texts, src_lang, tgt_lang, max_length=512):
        """Translate multiple texts at once"""
        translated_texts = []
        
        for text in texts:
            translated = self.translate(text, src_lang, tgt_lang, max_length)
            translated_texts.append(translated)
        
        return translated_texts
    
    def get_supported_languages(self):
        """Return list of supported language codes"""
        return list(self.supported_languages.keys())
    
    def is_translation_available(self):
        """Check if translation service is properly initialized"""
        return len(self.models) > 0 and len(self.tokenizers) > 0


# Fallback translation class for cases where IndicTrans2 is not available
class FallbackTranslator:
    """
    Fallback translator that uses basic dictionary-based translation
    or simple rules for common banking terms
    """
    
    def __init__(self):
        # Basic banking terms dictionary
        self.banking_terms = {
            # English to Hindi
            ('en', 'hi'): {
                'balance': 'बैलेंस',
                'account': 'खाता',
                'transaction': 'लेनदेन',
                'deposit': 'जमा',
                'withdrawal': 'निकासी',
                'loan': 'ऋण',
                'bank': 'बैंक',
                'money': 'पैसा',
                'transfer': 'स्थानांतरण',
                'payment': 'भुगतान',
                'credit': 'क्रेडिट',
                'debit': 'डेबिट',
                'hello': 'नमस्ते',
                'thank you': 'धन्यवाद',
                'help': 'मदद',
                'yes': 'हाँ',
                'no': 'नहीं'
            },
            # English to Marathi
            ('en', 'mr'): {
                'balance': 'शिल्लक',
                'account': 'खाते',
                'transaction': 'व्यवहार',
                'deposit': 'जमा',
                'withdrawal': 'काढणे',
                'loan': 'कर्ज',
                'bank': 'बँक',
                'money': 'पैसे',
                'transfer': 'हस्तांतरण',
                'payment': 'पेमेंट',
                'credit': 'क्रेडिट',
                'debit': 'डेबिट',
                'hello': 'नमस्कार',
                'thank you': 'धन्यवाद',
                'help': 'मदत',
                'yes': 'होय',
                'no': 'नाही'
            },
            # English to Gujarati
            ('en', 'gu'): {
                'balance': 'બેલેન્સ',
                'account': 'ખાતું',
                'transaction': 'વ્યવહાર',
                'deposit': 'જમા',
                'withdrawal': 'ઉપાડ',
                'loan': 'લોન',
                'bank': 'બેંક',
                'money': 'પૈસા',
                'transfer': 'ટ્રાન્સફર',
                'payment': 'ચુકવણી',
                'credit': 'ક્રેડિટ',
                'debit': 'ડેબિટ',
                'hello': 'નમસ્તે',
                'thank you': 'આભાર',
                'help': 'મદદ',
                'yes': 'હા',
                'no': 'ના'
            }
        }
    
    def translate(self, text, src_lang_code, tgt_lang_code):
        """Basic translation using dictionary lookup"""
        try:
            # Convert IndicTrans codes to simple language codes
            lang_map = {
                'hin_Deva': 'hi',
                'mar_Deva': 'mr', 
                'guj_Gujr': 'gu',
                'eng_Latn': 'en'
            }
            
            src_lang = lang_map.get(src_lang_code, src_lang_code)
            tgt_lang = lang_map.get(tgt_lang_code, tgt_lang_code)
            
            if src_lang == tgt_lang:
                return text
            
            # Get translation dictionary for this language pair
            lang_pair = (src_lang, tgt_lang)
            reverse_pair = (tgt_lang, src_lang)
            
            if lang_pair in self.banking_terms:
                translation_dict = self.banking_terms[lang_pair]
            elif reverse_pair in self.banking_terms:
                # Use reverse dictionary
                translation_dict = {v: k for k, v in self.banking_terms[reverse_pair].items()}
            else:
                # No translation available
                print(f"No fallback translation for {src_lang} -> {tgt_lang}")
                return text
            
            # Simple word-by-word translation
            words = text.lower().split()
            translated_words = []
            
            for word in words:
                # Remove punctuation for lookup
                clean_word = word.strip('.,!?;:')
                if clean_word in translation_dict:
                    translated_words.append(translation_dict[clean_word])
                else:
                    # Keep original word if no translation found
                    translated_words.append(word)
            
            return ' '.join(translated_words)
            
        except Exception as e:
            print(f"Fallback translation error: {e}")
            return text
    
    def is_translation_available(self):
        return True


# Factory function to create appropriate translator
def create_translator(use_indictrans2=True):
    """
    Factory function to create the best available translator
    
    Args:
        use_indictrans2: Whether to try loading IndicTrans2 first
    
    Returns:
        Translator instance
    """
    if use_indictrans2:
        try:
            return IndicTrans()
        except Exception as e:
            print(f"Failed to load IndicTrans2: {e}")
            print("Falling back to basic translation service")
            return FallbackTranslator()
    else:
        return FallbackTranslator()