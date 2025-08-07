// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2/promise');
// const axios = require('axios');
// const app = express();

// app.use(cors());
// app.use(express.json());

// const dbConfig = {
//   user: 'root',
//   password: 'Omk#1234',
//   host: 'localhost',
//   database: 'bank_chatbot'
// };

// const RASA_SERVER_URL = "http://localhost:5005/webhooks/rest/webhook";

// // Helper to get a DB connection
// async function getConnection() {
//   return await mysql.createConnection(dbConfig);
// }

// // Save chat to DB
// async function saveChatToDb(user_id, conversation_id, user_message, bot_response) {
//   const conn = await getConnection();
//   await conn.execute(
//     `INSERT INTO messages (conversation_id, user_message, bot_response, timestamp)
//      VALUES (?, ?, ?, ?)`,
//     [conversation_id, user_message, bot_response, new Date()]
//   );
//   await conn.end();
// }

// // Get chat history
// async function getChatHistory(user_id, conversation_id) {
//   const conn = await getConnection();
//   const [rows] = await conn.execute(
//     `SELECT user_message, bot_response
//      FROM messages
//      WHERE conversation_id = ?
//      ORDER BY timestamp ASC`,
//     [conversation_id]
//   );
//   await conn.end();
//   return rows;
// }

// // Chat endpoint
// app.post('/chat', async (req, res) => {
//   const { message: user_message, user_id, conversation_id } = req.body;

//   if (!user_message || !user_id || !conversation_id) {
//     return res.status(400).json({ error: "No message, user_id, or conversation_id provided" });
//   }

//   try {
//     const response = await axios.post(RASA_SERVER_URL, {
//       sender: user_id,
//       message: user_message
//     });

//     const bot_response = response.data;
//     let bot_text = "Sorry, I couldn't process your request.";
//     if (bot_response && bot_response.length > 0) {
//       bot_text = bot_response.map(r => r.text).filter(Boolean).join('\n\n');
//     }

//     await saveChatToDb(user_id, conversation_id, user_message, bot_text);

//     res.json(bot_response);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error communicating with Rasa" });
//   }
// });

// // Chat history endpoint
// app.get('/history', async (req, res) => {
//   const { user_id, conversation_id } = req.query;

//   if (!user_id || !conversation_id) {
//     return res.status(400).json({ error: "No user_id or conversation_id provided" });
//   }

//   try {
//     const history = await getChatHistory(user_id, conversation_id);
//     res.json(history);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // New conversation endpoint
// app.post('/new_conversation', async (req, res) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res.status(400).json({ error: "No user_id provided" });
//   }

//   const conversation_id = Date.now().toString();

//   try {
//     const conn = await getConnection();
//     await conn.execute(
//       `INSERT INTO conversations (user_id, conversation_id, timestamp)
//        VALUES (?, ?, ?)`,
//       [user_id, conversation_id, new Date()]
//     );
//     await conn.end();
//     res.json({ conversation_id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get conversations endpoint
// app.get('/conversations', async (req, res) => {
//   const { user_id } = req.query;

//   if (!user_id) {
//     return res.status(400).json({ error: "No user_id provided" });
//   }

//   try {
//     const conn = await getConnection();
//     const [rows] = await conn.execute(
//       `SELECT conversation_id FROM conversations WHERE user_id = ?`,
//       [user_id]
//     );
//     await conn.end();
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Delete conversation endpoint
// app.delete('/conversation', async (req, res) => {
//   const { user_id, conversation_id } = req.body;

//   if (!user_id || !conversation_id) {
//     return res.status(400).json({ error: "No user_id or conversation_id provided" });
//   }

//   try {
//     const conn = await getConnection();
//     await conn.execute(
//       `DELETE FROM messages WHERE conversation_id = ?`,
//       [conversation_id]
//     );
//     await conn.execute(
//       `DELETE FROM conversations WHERE conversation_id = ?`,
//       [conversation_id]
//     );
//     await conn.end();
//     res.json({ message: "Conversation deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.listen(5001, () => {
//   console.log('Server running on port 5001');