# NASA Data Explorer Backend

This is the backend API for the NASA Data Explorer chatbot and dashboard. It provides endpoints for:
- Space launches
- Planet data
- Chatbot answers (local knowledge base + online AI)

## Features
- Node.js + Express REST API
- MongoDB database for launches and planets
- Local knowledge base for instant answers
- Online AI integration (Hugging Face, OpenAI)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your API keys:
   ```env
   HUGGING_FACE_API_KEY=your_hf_key
   OPENAI_API_KEY=your_openai_key
   MONGO_URL=your_mongo_url
   ```
3. Start the server:
   ```bash
   npm start dev
   ```

## Endpoints
- `/v1/launches` — Launch data
- `/v1/planets` — Planet data
- `/v1/chatbot` — Chatbot Q&A
- `/health` — Health check

## Notes
- Requires MongoDB connection
- API keys for Hugging Face and/or OpenAI recommended for full chatbot functionality
- See source code for more details
