import torch
from transformers import (
    AutoModelForSeq2SeqLM,
    AutoTokenizer,
)
from .IndicTransToolkit import IndicProcessor

# model_name = "ai4bharat/indictrans2-indic-en-1B"
# tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name, trust_remote_code=True)
# ip = IndicProcessor(inference=True)

# input_sentences = [
#     "जब मैं छोटा था, मैं हर रोज़ पार्क जाता था।",
#     "हमने पिछले सप्ताह एक नई फिल्म देखी जो कि बहुत प्रेरणादायक थी।",
#     "अगर तुम मुझे उस समय पास मिलते, तो हम बाहर खाना खाने चलते।",
#     "मेरे मित्र ने मुझे उसके जन्मदिन की पार्टी में बुलाया है, और मैं उसे एक तोहफा दूंगा।",
# ]

# src_lang, tgt_lang = "hin_Deva", "eng_Latn"

# batch = ip.preprocess_batch(
#     input_sentences,
#     src_lang=src_lang,
#     tgt_lang=tgt_lang,
# )

# DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# # Tokenize the sentences and generate input encodings
# inputs = tokenizer(
#     batch,
#     truncation=True,
#     padding="longest",
#     return_tensors="pt",
#     return_attention_mask=True,
# ).to(DEVICE)

# # Generate translations using the model
# with torch.no_grad():
#     generated_tokens = model.generate(
#         **inputs,
#         use_cache=False,
#         min_length=0,
#         max_length=256,
#         num_beams=5,
#         num_return_sequences=1,
#     )

# # Decode the generated tokens into text
# with tokenizer.as_target_tokenizer():
#     generated_tokens = tokenizer.batch_decode(
#         generated_tokens.detach().cpu().tolist(),
#         skip_special_tokens=True,
#         clean_up_tokenization_spaces=True,
#     )

# # Postprocess the translations, including entity replacement
# translations = ip.postprocess_batch(generated_tokens, lang=tgt_lang)

# for input_sentence, translation in zip(input_sentences, translations):
#     print(f"{src_lang}: {input_sentence}")
#     print(f"{tgt_lang}: {translation}")

class Translator:
    def __init__(self):
        self.model_name = "ai4bharat/indictrans2-indic-en-1B"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name, trust_remote_code=True)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name, trust_remote_code=True)
        self.ip = IndicProcessor(inference=True)
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = self.model.to(self.device)

    def translate_batch(self, input_sentences, src_lang="hin_Deva", tgt_lang="eng_Latn"):
        batch = self.ip.preprocess_batch(
            input_sentences,
            src_lang=src_lang,
            tgt_lang=tgt_lang,
        )
        inputs = self.tokenizer(
            batch,
            truncation=True,
            padding="longest",
            return_tensors="pt",
            return_attention_mask=True,
        ).to(self.device)

        with torch.no_grad():
            generated_tokens = self.model.generate(
                **inputs,
                use_cache=False,
                min_length=0,
                max_length=256,
                num_beams=5,
                num_return_sequences=1,
            )

        with self.tokenizer.as_target_tokenizer():
            decoded = self.tokenizer.batch_decode(
                generated_tokens.detach().cpu().tolist(),
                skip_special_tokens=True,
                clean_up_tokenization_spaces=True,
            )

        translations = self.ip.postprocess_batch(decoded, lang=tgt_lang)
        return translations

print("Translation script finished running ✅")
# Example usage in Flask:
# from IndicTransToolkit.langTrans import Translator
# translator = Translator()
# translations = translator.translate_batch(["जब मैं छोटा था, मैं हर रोज़ पार्क जाता था।"], src_lang="hin_Deva", tgt_lang="eng_Latn")