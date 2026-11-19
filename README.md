# Company-Knowledge-Assistant
Company Knowledge Assistant

A locally running AI-powered knowledge assistant that allows users to ask questions about company documents and receive answers grounded in their content.

Built using Retrieval-Augmented Generation (RAG), PostgreSQL, pgvector, and Ollama.

The goal of this project is to explore how Large Language Models (LLMs) can be combined with custom knowledge bases to build AI applications that answer questions using private documents rather than relying entirely on their pretrained knowledge.

Overview

Traditional LLMs generate responses based on knowledge acquired during training. However, they don’t automatically know the contents of your company’s internal documents.

This project addresses that problem by implementing a RAG pipeline.

Users can upload company documents, such as employee handbooks and internal policies, and ask natural-language questions about their contents.

Instead of sending entire documents to the LLM, the application:

1. Extracts text from PDF documents.
2. Splits the text into smaller chunks.
3. Generates vector embeddings using nomic-embed-text.
4. Stores embeddings in PostgreSQL using pgvector.
5. Converts user questions into embeddings.
6. Uses semantic search to retrieve relevant information.
7. Passes the retrieved information to qwen3:1.7b.
8. Generates an answer grounded in the retrieved context.

Architecture

              PDF Documents
                    |
                    v
             Text Extraction
                    |
                    v
                 Chunking
                    |
                    v
          nomic-embed-text
                    |
                    v
           Vector Embeddings
                    |
                    v
              PostgreSQL
               + pgvector
                    |
                    |
              User Question
                    |
                    v
          nomic-embed-text
                    |
                    v
            Question Embedding
                    |
                    v
             Semantic Search
                    |
                    v
          Retrieve Relevant Chunks
                    |
                    v
             Context + Question
                    |
                    v
               qwen3:1.7b
                    |
                    v
             Generated Answer

Tech Stack

Technology	Purpose
TypeScript	Application development
Node.js	Runtime environment
PostgreSQL	Database
pgvector	Vector storage and similarity search
Ollama	Local model management and inference
nomic-embed-text	Embedding generation
qwen3:1.7b	Local LLM for answer generation
Docker	Database containerization
tsx	Running TypeScript scripts

Features

1. Document Ingestion

PDF documents can be processed and added to the knowledge base.

The ingestion pipeline:

* Extracts text from PDF files.
* Splits extracted text into manageable chunks.
* Generates embeddings using nomic-embed-text.
* Stores document metadata, text chunks, and embeddings in PostgreSQL.

2. Semantic Search

The application uses vector embeddings to understand the semantic meaning of questions.

Unlike traditional keyword search, semantic search can retrieve relevant information even when the question uses different wording from the original document.

For example:

Document:

“Full-time employees receive 20 days of paid annual leave per calendar year.”

Question:

“How much vacation time do employees get?”

The system can retrieve the relevant information despite the different terminology.

Similarity search is performed using pgvector.

3. Retrieval-Augmented Generation

After retrieving relevant chunks, the application passes them to the LLM as context.

The generation pipeline uses qwen3:1.7b to generate natural-language answers based on the retrieved information.

This approach allows the model to answer questions about information that wasn’t part of its original training data.

4. Hallucination Control

An important part of the project is reducing unsupported answers.

The generation pipeline includes several safeguards:

* Context grounding: The model is instructed to answer exclusively using retrieved document content.
* No external assumptions: The model is instructed not to fill information gaps using its pretrained knowledge.
* Explicit fallback: When sufficient information is unavailable, the model responds that it doesn’t have enough information.
* Partial answers: When only part of a question can be answered, the model is instructed to distinguish available information from missing information.
* Conflict awareness: The model is instructed to identify contradictory information in retrieved sources.
* Temperature control: Temperature is set to 0 to reduce generation randomness.

Note: These are prompt-based safeguards, not a guarantee against hallucinations. Retrieval confidence thresholds and automated answer verification are potential future improvements.

Example

Question:

How many annual leave days do employees receive?

Generated Answer:

Employees receive 20 days of paid annual leave per calendar year for full-time employees. Part-time entitlements are calculated pro rata based on their start date.

The answer is generated using retrieved company handbook content rather than relying on the LLM’s general knowledge.

Getting Started

Prerequisites

* Node.js
* npm
* Docker
* Ollama

1. Clone the repository

2. Install dependencies

npm install

3. Start PostgreSQL

The project uses PostgreSQL with the pgvector extension.

Start the database using Docker Compose:

docker compose up -d

4. Configure environment variables

Create a .env file containing your database connection settings.

Use your project’s database configuration as a reference.


5. Install Ollama models

Install Ollama and download both models:

ollama pull nomic-embed-text
ollama pull qwen3:1.7b

The models have separate responsibilities:

* nomic-embed-text: Generates embeddings for document chunks and user questions.
* qwen3:1.7b(or whatever LLM you prefer): Generates answers using retrieved context.

Make sure Ollama is running before generating embeddings or answers.

6. Run the application

Start the chat UI from the project root:

npx tsx src/index.ts

Then open http://localhost:3000 in your browser. The UI sends each question through the existing `test-rag.ts` script and displays the generated answer. Press Ctrl+C to stop the server.

To set a different port:

PORT=4000 npx tsx src/index.ts

To test the RAG pipeline:

npx tsx src/scripts/test-rag.ts "How many annual leave days do employees receive?"

You should see the retrieved chunks followed by an AI-generated answer.


This illustrates the main modules; additional scripts and configuration files may exist.

Future Improvements

* Retrieval confidence thresholds.
* Hybrid search (keyword + semantic search).
* Reranking retrieved documents.
* Document source citations and page references.
* Document update and deletion handling.
* REST API for external integrations.
* Conversation history and multi-turn conversations.
* Automated RAG evaluation and benchmarking.
* Experimenting with different embedding models.
* Local LLM fine-tuning.

Learning Objectives

This project is also a practical exploration of several AI engineering concepts:

* How embeddings represent semantic meaning.
* How vector databases work.
* How semantic similarity search works.
* How RAG architectures are implemented.
* How embedding models differ from generative LLMs.
* How LLMs interact with external knowledge.
* How to reduce hallucinations through context grounding.
* How to run LLMs locally using Ollama.

License

MIT License.
