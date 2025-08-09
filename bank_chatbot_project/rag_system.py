import PyPDF2
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import ollama
import os
import pickle

class BankingRAG:
    def __init__(self, model_name='llama3.2:1b'):
        """Initialize RAG system with offline components"""
        # Use a small, efficient embedding model (works offline after first download)
        print("Loading embedding model...")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Storage for documents and embeddings
        self.documents = []
        self.embeddings = None
        self.index = None
        self.model_name = model_name
        
        # Create directory for storing processed data
        self.data_dir = "rag_data"
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            
        print("RAG system initialized successfully")
        
    def load_pdf(self, pdf_path):
        """Load and chunk PDF documents into searchable segments"""
        try:
            print(f"Loading PDF: {pdf_path}")
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                # Extract text from all pages
                for page_num, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    text += f"\n--- Page {page_num + 1} ---\n{page_text}"
            
            # Simple but effective chunking strategy
            # Split by double newlines (paragraphs) and filter out short chunks
            raw_chunks = text.split('\n\n')
            chunks = []
            
            for chunk in raw_chunks:
                cleaned_chunk = chunk.strip()
                # Only keep chunks with substantial content (more than 50 characters)
                if len(cleaned_chunk) > 50:
                    chunks.append(cleaned_chunk)
            
            self.documents.extend(chunks)
            print(f"Successfully loaded {len(chunks)} text chunks from {pdf_path}")
            
        except Exception as e:
            print(f"Error loading PDF {pdf_path}: {e}")
    
    def load_text_file(self, txt_path):
        """Load plain text file for FAQ or terms"""
        try:
            print(f"Loading text file: {txt_path}")
            with open(txt_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Split by questions or sections (customize based on your format)
            if "Q:" in content or "Question:" in content:
                # FAQ format
                chunks = [chunk.strip() for chunk in content.split('Q:') if chunk.strip()]
            else:
                # Regular text - split by paragraphs
                chunks = [chunk.strip() for chunk in content.split('\n\n') if len(chunk.strip()) > 50]
            
            self.documents.extend(chunks)
            print(f"Successfully loaded {len(chunks)} text chunks from {txt_path}")
            
        except Exception as e:
            print(f"Error loading text file {txt_path}: {e}")
    
    def create_index(self):
        """Create searchable FAISS index from all loaded documents"""
        if not self.documents:
            print("No documents loaded! Please load PDF/text files first.")
            return False
        
        print(f"Creating search index for {len(self.documents)} documents...")
        
        # Generate embeddings for all documents
        embeddings = self.embedder.encode(self.documents, show_progress_bar=True)
        self.embeddings = np.array(embeddings)
        
        # Create FAISS index for fast similarity search
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)  # L2 distance for similarity
        self.index.add(self.embeddings)
        
        print(f"Search index created successfully with {len(self.documents)} documents")
        
        # Save index and documents for faster loading next time
        self._save_index()
        return True
    
    def _save_index(self):
        """Save the index and documents to disk for persistence"""
        try:
            # Save FAISS index
            faiss.write_index(self.index, os.path.join(self.data_dir, "faiss_index.bin"))
            
            # Save documents and embeddings
            with open(os.path.join(self.data_dir, "documents.pkl"), 'wb') as f:
                pickle.dump(self.documents, f)
            
            with open(os.path.join(self.data_dir, "embeddings.pkl"), 'wb') as f:
                pickle.dump(self.embeddings, f)
                
            print("Index saved to disk for faster loading next time")
        except Exception as e:
            print(f"Warning: Could not save index: {e}")
    
    def load_saved_index(self):
        """Load previously saved index and documents"""
        try:
            index_path = os.path.join(self.data_dir, "faiss_index.bin")
            docs_path = os.path.join(self.data_dir, "documents.pkl")
            embeddings_path = os.path.join(self.data_dir, "embeddings.pkl")
            
            if all(os.path.exists(p) for p in [index_path, docs_path, embeddings_path]):
                # Load FAISS index
                self.index = faiss.read_index(index_path)
                
                # Load documents and embeddings
                with open(docs_path, 'rb') as f:
                    self.documents = pickle.load(f)
                
                with open(embeddings_path, 'rb') as f:
                    self.embeddings = pickle.load(f)
                
                print(f"Loaded saved index with {len(self.documents)} documents")
                return True
        except Exception as e:
            print(f"Could not load saved index: {e}")
        
        return False
    
    def search(self, query, k=3):
        """Search for most relevant documents based on user query"""
        if self.index is None:
            print("No search index available. Please create index first.")
            return []
        
        try:
            # Convert query to embedding
            query_embedding = self.embedder.encode([query])
            
            # Search for k most similar documents
            distances, indices = self.index.search(query_embedding, k)
            
            # Return relevant documents with their similarity scores
            results = []
            for i, idx in enumerate(indices[0]):
                if idx < len(self.documents) and distances[0][i] < 2.0:  # Filter out very dissimilar results
                    results.append({
                        'text': self.documents[idx],
                        'score': float(distances[0][i])
                    })
            
            print(f"Found {len(results)} relevant documents for query")
            return results
            
        except Exception as e:
            print(f"Search error: {e}")
            return []
    
    def generate_response(self, query, user_context="", conversation_history=[]):
        """Generate response using RAG + local LLM"""
        try:
            # Get relevant banking documents
            relevant_docs = self.search(query, k=2)
            
            if not relevant_docs:
                context = "No specific banking documents found for this query."
            else:
                context = "\n\n".join([doc['text'] for doc in relevant_docs])
            
            # Build conversation context from history (last 4 messages)
            conv_context = ""
            if conversation_history:
                recent_history = conversation_history[-4:]  # Keep it manageable
                conv_context = "\n".join([
                    f"User: {msg.get('user_message', '')}\nBot: {msg.get('bot_response', '')}" 
                    for msg in recent_history
                ])
            
            # Prepare comprehensive prompt for the LLM
            prompt = f"""You are a helpful and knowledgeable banking assistant. Use the provided banking context to answer the user's question accurately and professionally.

Banking Context:
{context}

{f"User Context: {user_context}" if user_context else ""}

{f"Recent Conversation History:{conv_context}" if conv_context else ""}

Current User Question: {query}

Instructions:
- Provide a clear, helpful, and accurate response based on the banking context
- If the context doesn't contain relevant information, provide general banking guidance if appropriate
- Keep responses concise but comprehensive
- Use a professional but friendly tone
- If you cannot answer based on available information, say so honestly

Response:"""

            # Generate response using local Ollama
            print("Generating RAG response with local LLM...")
            response = ollama.generate(
                model=self.model_name,
                prompt=prompt
            )
            
            return response['response'].strip()
            
        except Exception as e:
            print(f"RAG response generation error: {e}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again or contact customer service for assistance."
    
    def is_banking_query(self, text):
        """Simple classifier to determine if query is banking-related"""
        banking_keywords = [
            'account', 'balance', 'loan', 'credit', 'debit', 'transaction', 
            'bank', 'card', 'atm', 'deposit', 'withdrawal', 'transfer',
            'interest', 'savings', 'checking', 'mortgage', 'investment',
            'statement', 'fee', 'overdraft', 'pin', 'branch', 'online banking'
        ]
        
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in banking_keywords)

# Global RAG instance (will be initialized in app.py)
banking_rag = None