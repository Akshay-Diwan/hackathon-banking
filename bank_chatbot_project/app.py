from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import mysql.connector
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
import psycopg2
import psycopg2.extras

# PostgreSQL setup
db_config = {
    'user': 'postgres',
    'password': os.getenv('PASS_KEY'),
    'host': 'localhost',
    'dbname': 'banking'
}

def get_pg_connection():
    return psycopg2.connect(**db_config)

# Load environment variables
dotenv.load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

# Create audio files directory
AUDIO_DIR = "audio_files"
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

def remove_emojis(text):
    """Remove emojis and other unwanted characters from text for TTS"""
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
    
    text = emoji_pattern.sub(r'', text)
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
        print(f"[DEBUG] Detecting language for text: {text}")
        
        # First check for script-based detection
        # Check for Devanagari script (Hindi/Marathi)
        if any('\u0900' <= char <= '\u097F' for char in text):
            print("[DEBUG] Devanagari script detected")
            # Try to distinguish between Hindi and Marathi
            marathi_chars = ['\u0902', '\u0903', '\u0945', '\u0949', '\u094A', '\u094B', '\u094C']
            if any(char in text for char in marathi_chars):
                print("[DEBUG] Detected as Marathi")
                return 'mr'
            print("[DEBUG] Detected as Hindi")
            return 'hi'
        
        # Check for Gujarati script
        if any('\u0A80' <= char <= '\u0AFF' for char in text):
            print("[DEBUG] Detected as Gujarati")
            return 'gu'
            
        # Fallback to langdetect
        detected = detect(text)
        mapped_lang = LANGUAGE_MAPPING.get(detected, 'en')
        print(f"[DEBUG] langdetect result: {detected}, mapped to: {mapped_lang}")
        return mapped_lang
    except Exception as e:
        print(f"[DEBUG] Language detection error: {e}, defaulting to English")
        return 'en'

def speech_to_text(audio_file_path, language='en'):
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
        
        # Try the detected language first, then fallback to others
        codes_to_try = language_codes.get(language, ['en-IN'])
        
        # Also try Hindi if language detection failed or gave English
        if language == 'en':
            codes_to_try.extend(['hi-IN', 'mr-IN'])
        
        for lang_code in codes_to_try:
            try:
                print(f"[DEBUG] Trying speech recognition with: {lang_code}")
                text = recognizer.recognize_google(audio, language=lang_code)
                print(f"[DEBUG] Speech recognition result: {text}")
                detected_lang = detect_language(text)
                print(f"[DEBUG] Final detected language: {detected_lang}")
                return text, detected_lang
            except sr.UnknownValueError:
                print(f"[DEBUG] Speech recognition failed for {lang_code}")
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

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    print(f"Received data: {data}")
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")
    
    # FIXED: Properly detect language from the message text
    detected_language = detect_language(user_message) if user_message else "en"
    print(f"Final detected language for chat: {detected_language}")

    if not user_message or not user_id or not conversation_id:
        return jsonify({"error": "No message, user_id, or conversation_id provided"}), 400

    print(f"Received message from user {user_id} in conversation {conversation_id}: {user_message}")
    print(f"Detected language: {detected_language}")

    # Send message to Rasa with language context
    response = requests.post(
        RASA_SERVER_URL,
        json={
            "sender": user_id, 
            "message": user_message,
            "metadata": {
                "language": detected_language,
                "preferred_language": detected_language
            }
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
    
    # Save chat to database with language info
    save_chat_to_db(user_id, conversation_id, user_message, bot_text, detected_language, audio_filename)

    # Return response with audio filename
    response_data = bot_response.copy() if bot_response else []
    response_data.append({
        "audio_response": audio_filename,
        "language": detected_language
    })

    return jsonify(response_data)

@app.route('/audio_chat', methods=['POST'])
def audio_chat():
    """Handle audio input for chat"""
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

        # FIXED: Call speech_to_text with default language parameter
        user_message, detected_language = speech_to_text(wav_path, 'en')  # Start with 'en' but will try multiple languages

        # Cleanup
        try:
            os.remove(webm_path)
            os.remove(wav_path)
        except Exception as e:
            print(f"[WARN] Cleanup failed: {e}")
        
        if not user_message:
            return jsonify({"error": "Could not understand audio"}), 400
        
        print(f"Transcribed text: {user_message}")
        print(f"Detected language: {detected_language}")
        
        # Process the transcribed message through regular chat flow
        chat_data = {
            "message": user_message,
            "user_id": user_id,
            "conversation_id": conversation_id,
            "language": detected_language
        }
        
        # Call the regular chat endpoint internally
        return chat_internal(chat_data)
        
    except Exception as e:
        print(f"Audio chat error: {e}")
        return jsonify({"error": "Audio processing failed"}), 500

def chat_internal(data):
    """Internal chat processing function"""
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")
    detected_language = data.get("language", "en")

    # Send message to Rasa
    response = requests.post(
        RASA_SERVER_URL,
        json={
            "sender": user_id, 
            "message": user_message,
            "metadata": {
                "language": detected_language,
                "preferred_language": detected_language
            }
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
    else:
        bot_text = "Sorry, I couldn't process your request."

    # Generate audio response
    audio_filename = text_to_speech(bot_text, detected_language)
    
    # Save to database
    save_chat_to_db(user_id, conversation_id, user_message, bot_text, detected_language, audio_filename)

    # Return response
    response_data = {
        "transcribed_text": user_message,
        "bot_response": bot_text,
        "audio_response": audio_filename,
        "language": detected_language,
        "rasa_response": bot_response
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

def save_chat_to_db(user_id, conversation_id, user_message, bot_response, language="en", audio_file=None):
    conn = get_pg_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO chatbot.messages (conversation_id, user_message, bot_response, timestamp, language, audio_file)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (conversation_id, user_message, bot_response, datetime.now(timezone.utc), language, audio_file))
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Saved chat to DB: user_id={user_id}, conversation_id={conversation_id}, language={language}, audio_file={audio_file}")

def get_chat_history(user_id, conversation_id):
    conn = get_pg_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT user_message, bot_response, language, audio_file, timestamp
        FROM chatbot.messages
        WHERE conversation_id = %s
        ORDER BY timestamp ASC
    """, (conversation_id,))
    history = cursor.fetchall()
    cursor.close()
    conn.close()
    print(f"Retrieved chat history for user {user_id} in conversation {conversation_id}: {len(history)} chatbot.messages")
    return history

@app.route('/history', methods=['GET'])
def chat_history():
    user_id = request.args.get("user_id")
    conversation_id = request.args.get("conversation_id")
    
    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    history = get_chat_history(user_id, conversation_id)
    return jsonify(history)

@app.route('/new_conversation', methods=['POST'])
def new_conversation():
    data = request.json
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    conversation_id = str(datetime.now(timezone.utc).timestamp())

    conn = get_pg_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO chatbot.conversations (user_id, conversation_id, timestamp)
        VALUES (%s, %s, %s)
    """, (user_id, conversation_id, datetime.now(timezone.utc)))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"conversation_id": conversation_id})

@app.route('/conversations', methods=['GET'])
def get_conversations():
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    conn = get_pg_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT conversation_id
        FROM chatbot.conversations
        WHERE user_id = %s
    """, (user_id,))
    conversations = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(conversations)

@app.route('/conversation', methods=['DELETE'])
def delete_conversation():
    data = request.json
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")

    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    conn = get_pg_connection()
    cursor = conn.cursor()

    # First, retrieve bot responses associated with the conversation
    cursor.execute("""
        SELECT audio_file FROM chatbot.messages WHERE conversation_id = %s
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

    # Now delete chatbot.messages and conversation
    cursor.execute("DELETE FROM chatbot.messages WHERE conversation_id = %s", (conversation_id,))
    cursor.execute("DELETE FROM chatbot.conversations WHERE conversation_id = %s", (conversation_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Conversation and associated audio files deleted."})

if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5001, debug=True)