from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
#import mysql.connector
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timezone
import speech_recognition as sr
from gtts import gTTS
import os
import tempfile
import uuid
from langdetect import detect
import io
from pydub import AudioSegment
import dotenv
import re

# Import our RAG system
from rag_system import BankingRAG, banking_rag

# Load environment variables
dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MySQL setup
db_config = {
    'user': 'root',
    'password': os.getenv('PASS_KEY'),
    'host': 'localhost',
    'database': 'postgres',
    'port': 5432
}

def get_db_connection():
    return psycopg2.connect(**db_config)

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

# Create audio files directory
AUDIO_DIR = "audio_files"
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

# Global RAG instance
rag_system = None

def remove_emojis(text):
    """Remove emojis and other unwanted characters from text for TTS"""
    # Remove emojis using regex
    emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        u"\U00002500-\U00002BEF"  # chinese char
        u"\U00002702-\U000027B0"
        u"\U00002702-\U000027B0"
        u"\U000024C2-\U0001F251"
        u"\U0001f926-\U0001f937"
        u"\U00010000-\U0010ffff"
        u"\u2640-\u2642" 
        u"\u2600-\u2B55"
        u"\u200d"
        u"\u23cf"
        u"\u23e9"
        u"\u231a"
        u"\ufe0f"  # dingbats
        u"\u3030"
        "]+", flags=re.UNICODE)
    
    # Remove emojis
    text = emoji_pattern.sub(r'', text)
    
    # Clean up extra spaces and newlines
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

# Language detection mapping
LANGUAGE_MAPPING = {
    'en': 'en',
    'hi': 'hi', 
    'mr': 'mr',  # Marathi
    'gu': 'gu'   # Gujarati
}

def detect_language(text):
    """Detect language from text and map to supported languages"""
    try:
        detected = detect(text)
        return LANGUAGE_MAPPING.get(detected, 'en')  # Default to English
    except:
        return 'en'

def speech_to_text(audio_file_path, language='en-IN'):
    """Convert speech to text using Google Speech Recognition"""
    recognizer = sr.Recognizer()
    
    try:
        with sr.AudioFile(audio_file_path) as source:
            audio = recognizer.record(source)
        
        # Try multiple language codes for better recognition
        language_codes = {
            'en': ['en-IN', 'en-US'],
            'hi': ['hi-IN'],
            'mr': ['mr-IN'],
            'gu': ['gu-IN']
        }
        
        for lang_code in language_codes.get(language, ['en-IN']):
            try:
                text = recognizer.recognize_google(audio, language=lang_code)
                detected_lang = detect_language(text)
                return text, detected_lang
            except sr.UnknownValueError:
                continue
        
        return None, None
    except Exception as e:
        print(f"Speech recognition error: {e}")
        return None, None

def text_to_speech(text, language='en'):
    """Convert text to speech using gTTS"""
    try:
        # Language mapping for gTTS
        gtts_lang_map = {
            'en': 'en',
            'hi': 'hi',
            'mr': 'mr',
            'gu': 'gu'
        }
        
        tts_lang = gtts_lang_map.get(language, 'en')
        # Clean text for TTS (remove emojis)
        clean_text = remove_emojis(text)
        if not clean_text.strip():  # If nothing left after cleaning, use fallback
            clean_text = "Response received"
        
        tts = gTTS(text=clean_text, lang=tts_lang, slow=False)
        
        # Generate unique filename
        audio_filename = f"response_{uuid.uuid4()}.mp3"
        audio_path = os.path.join(AUDIO_DIR, audio_filename)
        
        tts.save(audio_path)
        return audio_filename
    except Exception as e:
        print(f"Text-to-speech error: {e}")
        return None

def get_conversation_history(conversation_id, limit=5):
    """Get recent conversation history for RAG context"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT user_message, bot_response
            FROM messages
            WHERE conversation_id = %s
            ORDER BY timestamp DESC
            LIMIT %s
        """, (conversation_id, limit))
        history = cursor.fetchall()
        cursor.close()
        conn.close()
        # Return in chronological order (oldest first)
        return list(reversed(history))
    except Exception as e:
        print(f"Error getting conversation history: {e}")
        return []

@app.route('/chat', methods=['POST'])
def chat():
    """Original chat endpoint - routes to appropriate system based on query type"""
    data = request.json
    print(f"Received data: {data}")
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")
    detected_language = data.get("language", "en")

    if not user_message or not user_id or not conversation_id:
        return jsonify({"error": "No message, user_id, or conversation_id provided"}), 400

    print(f"Received message from user {user_id} in conversation {conversation_id}: {user_message}")
    print(f"Detected language: {detected_language}")

    # Smart routing: Use RAG for banking queries, Rasa for general conversation
    global rag_system
    if rag_system and rag_system.is_banking_query(user_message):
        print("Routing to RAG system (banking query detected)")
        return handle_rag_chat(user_message, user_id, conversation_id, detected_language)
    else:
        print("Routing to Rasa system (general conversation)")
        return handle_rasa_chat(user_message, user_id, conversation_id, detected_language)

def handle_rasa_chat(user_message, user_id, conversation_id, detected_language):
    """Handle chat through Rasa system (your original implementation)"""
    # Send message to Rasa with language context
    response = requests.post(
        RASA_SERVER_URL,
        json={
            "sender": user_id, 
            "message": user_message,
            "metadata": {"language": detected_language}
        }
    )

    if response.status_code != 200:
        print(f"Error communicating with Rasa: {response.status_code}")
        return jsonify({"error": "Error communicating with Rasa"}), 500

    bot_response = response.json()
    print(f"Received response from Rasa: {bot_response}")
    
    # Extract the complete bot response text by combining all parts
    if bot_response and len(bot_response) > 0:
        bot_text_parts = []
        for response_part in bot_response:
            if 'text' in response_part:
                bot_text_parts.append(response_part['text'])
        
        bot_text = '\n\n'.join(bot_text_parts)
        print(f"Combined bot text length: {len(bot_text)}")
    else:
        bot_text = "Sorry, I couldn't process your request."

    # Generate audio response
    audio_filename = text_to_speech(bot_text, detected_language)
    
    # Save chat to database with language info and source
    save_chat_to_db(user_id, conversation_id, user_message, bot_text, detected_language, audio_filename, source="rasa")

    # Return response with audio filename - always include audio info
    response_data = bot_response.copy() if bot_response else []
    response_data.append({
        "audio_response": audio_filename,
        "language": detected_language,
        "source": "rasa"
    })

    return jsonify(response_data)

def handle_rag_chat(user_message, user_id, conversation_id, detected_language):
    """Handle chat through RAG system for banking queries"""
    global rag_system
    
    try:
        # Get conversation history for context
        conversation_history = get_conversation_history(conversation_id, limit=4)
        
        # Generate RAG response
        print("Generating RAG response...")
        bot_text = rag_system.generate_response(
            query=user_message,
            user_context=f"User ID: {user_id}",
            conversation_history=conversation_history
        )
        
        # Generate audio response
        audio_filename = text_to_speech(bot_text, detected_language)
        
        # Save to database with RAG source
        save_chat_to_db(user_id, conversation_id, user_message, bot_text, detected_language, audio_filename, source="rag")
        
        # Return response in consistent format
        response_data = [{
            "text": bot_text
        }, {
            "audio_response": audio_filename,
            "language": detected_language,
            "source": "rag"
        }]
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"RAG chat error: {e}")
        # Fallback to error response
        error_text = "I apologize, but I'm having trouble with your banking inquiry right now. Please try again or contact customer service."
        audio_filename = text_to_speech(error_text, detected_language)
        
        response_data = [{
            "text": error_text
        }, {
            "audio_response": audio_filename,
            "language": detected_language,
            "source": "error"
        }]
        
        return jsonify(response_data)

@app.route('/rag_chat', methods=['POST'])
def rag_chat_direct():
    """Direct RAG endpoint for banking queries"""
    data = request.json
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")
    detected_language = data.get("language", "en")

    if not user_message or not user_id or not conversation_id:
        return jsonify({"error": "No message, user_id, or conversation_id provided"}), 400

    return handle_rag_chat(user_message, user_id, conversation_id, detected_language)

@app.route('/force_rasa', methods=['POST'])
def force_rasa():
    """Force use of Rasa system regardless of query type"""
    data = request.json
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")
    detected_language = data.get("language", "en")

    if not user_message or not user_id or not conversation_id:
        return jsonify({"error": "No message, user_id, or conversation_id provided"}), 400

    return handle_rasa_chat(user_message, user_id, conversation_id, detected_language)

@app.route('/audio_chat', methods=['POST'])
def audio_chat():
    """Handle audio input for chat (works with both Rasa and RAG)"""
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        user_id = request.form.get('user_id')
        conversation_id = request.form.get('conversation_id')
        
        if not user_id or not conversation_id:
            return jsonify({"error": "Missing user_id or conversation_id"}), 400
        
        # Save the webm file temporarily
        webm_path = os.path.join(AUDIO_DIR, f"temp_{uuid.uuid4()}.webm")
        audio_file.save(webm_path)

        # Convert to WAV
        wav_path = os.path.join(AUDIO_DIR, f"temp_{uuid.uuid4()}.wav")
        AudioSegment.from_file(webm_path).export(wav_path, format="wav")

        # Convert speech to text
        user_message, detected_language = speech_to_text(wav_path)

        # Cleanup temp files
        try:
            os.remove(webm_path)
            os.remove(wav_path)
        except Exception as e:
            print(f"[WARN] Cleanup failed: {e}")

        if not user_message:
            return jsonify({"error": "Could not understand audio"}), 400
        
        print(f"Transcribed text: {user_message}")
        print(f"Detected language: {detected_language}")
        
        # Process through the smart routing system
        chat_data = {
            "message": user_message,
            "user_id": user_id,
            "conversation_id": conversation_id,
            "language": detected_language
        }
        
        # Call the smart chat routing internally
        return chat_internal(chat_data)
        
    except Exception as e:
        print(f"Audio chat error: {e}")
        return jsonify({"error": "Audio processing failed"}), 500

def chat_internal(data):
    """Internal chat processing with smart routing"""
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")
    detected_language = data.get("language", "en")

    # Use smart routing like in the main chat endpoint
    global rag_system
    if rag_system and rag_system.is_banking_query(user_message):
        # RAG response
        try:
            conversation_history = get_conversation_history(conversation_id, limit=4)
            bot_text = rag_system.generate_response(
                query=user_message,
                user_context=f"User ID: {user_id}",
                conversation_history=conversation_history
            )
            source = "rag"
        except Exception as e:
            print(f"RAG error in audio chat: {e}")
            bot_text = "I apologize, but I'm having trouble processing your banking inquiry right now."
            source = "error"
    else:
        # Rasa response
        response = requests.post(
            RASA_SERVER_URL,
            json={
                "sender": user_id, 
                "message": user_message,
                "metadata": {"language": detected_language}
            }
        )

        if response.status_code != 200:
            return jsonify({"error": "Error communicating with Rasa"}), 500

        bot_response = response.json()
        
        # Combine response parts
        if bot_response and len(bot_response) > 0:
            bot_text_parts = []
            for response_part in bot_response:
                if 'text' in response_part:
                    bot_text_parts.append(response_part['text'])
            bot_text = '\n\n'.join(bot_text_parts)
            source = "rasa"
        else:
            bot_text = "Sorry, I couldn't process your request."
            source = "error"

    # Generate audio response
    audio_filename = text_to_speech(bot_text, detected_language)
    
    # Save to database
    save_chat_to_db(user_id, conversation_id, user_message, bot_text, detected_language, audio_filename, source)

    # Return response
    response_data = {
        "transcribed_text": user_message,
        "bot_response": bot_text,
        "audio_response": audio_filename,
        "language": detected_language,
        "source": source
    }

    return jsonify(response_data)

@app.route('/audio/<filename>')
def serve_audio(filename):
    """Serve audio files"""
    try:
        audio_path = os.path.join(AUDIO_DIR, filename)
        if os.path.exists(audio_path):
            return send_file(audio_path, as_attachment=False)
        else:
            return jsonify({"error": "Audio file not found"}), 404
    except Exception as e:
        print(f"Audio serving error: {e}")
        return jsonify({"error": "Error serving audio"}), 500

def save_chat_to_db(user_id, conversation_id, user_message, bot_response, language="en", audio_file=None, source="unknown"):
    """Save chat to database with source tracking"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if source column exists, if not add it
    try:
        cursor.execute("ALTER TABLE messages ADD COLUMN source VARCHAR(10) DEFAULT 'rasa'")
        conn.commit()
        print("Added source column to messages table")
    except mysql.connector.Error:
        # Column already exists
        pass
    
    cursor.execute("""
        INSERT INTO messages (conversation_id, user_message, bot_response, timestamp, language, audio_file, source)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (conversation_id, user_message, bot_response, datetime.now(timezone.utc), language, audio_file, source))
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Saved chat to DB: user_id={user_id}, conversation_id={conversation_id}, language={language}, audio_file={audio_file}, source={source}")

def get_chat_history(user_id, conversation_id):
    """Get chat history (unchanged from original)"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT user_message, bot_response, language, audio_file, timestamp
        FROM messages
        WHERE conversation_id = %s
        ORDER BY timestamp ASC
    """, (conversation_id,))
    history = cursor.fetchall()
    cursor.close()
    conn.close()
    print(f"Retrieved chat history for user {user_id} in conversation {conversation_id}: {len(history)} messages")
    return history

@app.route('/history', methods=['GET'])
def chat_history():
    """Get chat history endpoint (unchanged)"""
    user_id = request.args.get("user_id")
    conversation_id = request.args.get("conversation_id")
    
    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    history = get_chat_history(user_id, conversation_id)
    return jsonify(history)

@app.route('/new_conversation', methods=['POST'])
def new_conversation():
    """Create new conversation (unchanged)"""
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    conversation_id = str(datetime.now(timezone.utc).timestamp())

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO conversations (user_id, conversation_id, timestamp)
        VALUES (%s, %s, %s)
    """, (user_id, conversation_id, datetime.now(timezone.utc)))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"conversation_id": conversation_id})

@app.route('/conversations', methods=['GET'])
def get_conversations():
    """Get user conversations (unchanged)"""
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT conversation_id
        FROM conversations
        WHERE user_id = %s
    """, (user_id,))
    conversations = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(conversations)

@app.route('/conversation', methods=['DELETE'])
def delete_conversation():
    """Delete conversation (unchanged)"""
    data = request.json
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")

    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # First, retrieve bot responses associated with the conversation
    cursor.execute("""
        SELECT audio_file FROM messages WHERE conversation_id = %s
    """, (conversation_id,))
    audio_files = cursor.fetchall()

    # Attempt to find and delete associated audio files
    for (audio_file,) in audio_files:
        if audio_file:
            audio_path = os.path.join(AUDIO_DIR, audio_file)
            if os.path.exists(audio_path):
                try:
                    os.remove(audio_path)
                    print(f"[INFO] Deleted audio file: {audio_path}")
                except Exception as e:
                    print(f"[WARN] Failed to delete audio file: {audio_path} | Error: {e}")

    # Now delete messages and conversation
    cursor.execute("DELETE FROM messages WHERE conversation_id = %s", (conversation_id,))
    cursor.execute("DELETE FROM conversations WHERE conversation_id = %s", (conversation_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Conversation and associated audio files deleted."})

@app.route('/rag_status', methods=['GET'])
def rag_status():
    """Check RAG system status and document count"""
    global rag_system
    if rag_system:
        return jsonify({
            "status": "active",
            "documents_loaded": len(rag_system.documents),
            "index_ready": rag_system.index is not None
        })
    else:
        return jsonify({
            "status": "inactive",
            "documents_loaded": 0,
            "index_ready": False
        })

def initialize_rag_system():
    """Initialize RAG system on startup"""
    global rag_system
    if not os.path.exists('rag_data'):
        print("rag_data folder not found - RAG system disabled")
        rag_system = None
        return

    try:
        print("Initializing RAG system...")
        rag_system = BankingRAG()
        
        # Try to load saved index first
        if rag_system.load_saved_index():
            print("RAG system ready with saved index")
            return
        
        # If no saved index, look for PDF files to load
        pdf_files = [os.path.join('rag_data', f) for f in os.listdir('rag_data') if f.endswith('.pdf')]
        txt_files = [os.path.join('rag_data', f) for f in os.listdir('rag_data') if f.endswith('.txt')]
        
        if pdf_files or txt_files:
            print(f"Found {len(pdf_files)} PDF files and {len(txt_files)} text files")
            
            # Load PDF files
            for pdf_file in pdf_files:
                print(f"Loading {pdf_file}...")
                rag_system.load_pdf(pdf_file)
            
            # Load text files
            for txt_file in txt_files:
                print(f"Loading {txt_file}...")
                rag_system.load_text_file(txt_file)
            
            # Create search index
            if rag_system.documents:
                rag_system.create_index()
                print("RAG system initialized successfully")
            else:
                print("No documents loaded - RAG system will be disabled")
                rag_system = None
        else:
            print("No PDF or FAQ text files found - RAG system disabled")
            print("To enable RAG, place PDF files or FAQ text files in the project directory")
            rag_system = None
            
    except Exception as e:
        print(f"Failed to initialize RAG system: {e}")
        print("RAG system disabled - falling back to Rasa only")
        rag_system = None

if __name__ == '__main__': 
    # Initialize RAG system before starting the server
    initialize_rag_system()
    
    print("Starting Flask server...")
    print("Available endpoints:")
    print("  /chat - Smart routing (RAG for banking, Rasa for general)")
    print("  /rag_chat - Force RAG system")
    print("  /force_rasa - Force Rasa system")
    print("  /audio_chat - Audio input with smart routing")
    print("  /rag_status - Check RAG system status")
    
    app.run(host='0.0.0.0', port=5001, debug=True)