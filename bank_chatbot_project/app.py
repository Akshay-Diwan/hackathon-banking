from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import mysql.connector
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MySQL setup
db_config = {
    'user': 'root',
    'password': 'Omk#1234',
    'host': 'localhost',
    'database': 'bank_chatbot'
}

RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    print(f"Received data: {data}")  # Log incoming data
    user_message = data.get("message")
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")  # Conversation ID

    if not user_message or not user_id or not conversation_id:
        return jsonify({"error": "No message, user_id, or conversation_id provided"}), 400

    print(f"Received message from user {user_id} in conversation {conversation_id}: {user_message}")

    # Send message to Rasa
    response = requests.post(
        RASA_SERVER_URL,
        json={"sender": user_id, "message": user_message}
    )

    if response.status_code != 200:
        print(f"Error communicating with Rasa: {response.status_code}")
        return jsonify({"error": "Error communicating with Rasa"}), 500

    bot_response = response.json()
    print(f"Received response from Rasa: {bot_response}")
    
    # Debug: Print the full response structure
    print(f"Full bot response structure: {bot_response}")
    if bot_response and len(bot_response) > 0:
        print(f"First response text: {repr(bot_response[0].get('text', ''))}")
    
    # Extract the complete bot response text by combining all parts
    if bot_response and len(bot_response) > 0:
        # Combine all text responses into one complete message
        bot_text_parts = []
        for response_part in bot_response:
            if 'text' in response_part:
                bot_text_parts.append(response_part['text'])
        
        bot_text = '\n\n'.join(bot_text_parts)  # Join with double newlines for better formatting
        print(f"Combined bot text length: {len(bot_text)}")
        print(f"Number of response parts: {len(bot_response)}")
        print(f"Combined bot text content: {repr(bot_text)}")
    else:
        bot_text = "Sorry, I couldn't process your request."

    # Save user message and bot response to MySQL
    save_chat_to_db(user_id, conversation_id, user_message, bot_text)

    return jsonify(bot_response)


def save_chat_to_db(user_id, conversation_id, user_message, bot_response):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO messages (conversation_id, user_message, bot_response, timestamp)
        VALUES (%s, %s, %s, %s)
    """, (conversation_id, user_message, bot_response, datetime.now(timezone.utc)))
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Saved chat to DB: user_id={user_id}, conversation_id={conversation_id}, user_message={user_message[:50]}..., bot_response length={len(bot_response)}")

def get_chat_history(user_id, conversation_id):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT user_message, bot_response
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
    user_id = request.args.get("user_id")
    conversation_id = request.args.get("conversation_id")  # Get conversation_id from query params
    
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

    # Create a new conversation ID (could be a UUID or a timestamp-based string)
    conversation_id = str(datetime.now(timezone.utc).timestamp())  # Use timezone-aware datetime

    conn = mysql.connector.connect(**db_config)
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
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"error": "No user_id provided"}), 400

    conn = mysql.connector.connect(**db_config)
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
    data = request.json
    user_id = data.get("user_id")
    conversation_id = data.get("conversation_id")

    if not user_id or not conversation_id:
        return jsonify({"error": "No user_id or conversation_id provided"}), 400

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("""
        DELETE FROM messages WHERE conversation_id = %s
    """, (conversation_id,))
    cursor.execute("""
        DELETE FROM conversations WHERE conversation_id = %s
    """, (conversation_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Conversation deleted"})

if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5001, debug=True)