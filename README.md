# STREAMBot Chatbot

This is a Next.js project for the **STREAMBot Chatbot**, designed to provide intelligent responses based on website documentation.

## Getting Started

### 1. Clone the Repository

First, clone the repository to your local system:

```bash
git clone <repository-url>
cd streambot-chatbot
```

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

> **Note:** The required dependencies are listed in `requirements.txt` for reference.

### 3. Setup AstraDB and OpenAI Credentials

You need an account on **DataStax AstraDB** to get the serverless vector database credentials. Similarly, you need an **OpenAI API key** for chatbot responses.

1. Create an account on [DataStax AstraDB](https://www.datastax.com/products/datastax-astra)
2. Obtain the **VectorDB credentials** and store them in a `.env` file.
3. Obtain an **OpenAI API Key** from [OpenAI](https://openai.com/) and store it in `.env`.

Example `.env` file:

```env
ASTRA_DB_NAMESPACE="default_keyspace"
ASTRA_DB_COLLECTION="stream_gpt"
ASTRA_DB_API_ENDPOINT=<your-api-endpoint>
ASTRA_DB_APPLICATION_TOKEN=<your-application-token>
OPENAI_API_KEY=<your-openai-api-key>
```

### 4. Store Website Data

Place the **PDF file containing website documentation** inside the `pdfs/` folder. This document will be used to generate embeddings for the chatbot.

### 5. Generate Embeddings

Run the following command to process the PDF and store embeddings in the cloud database:

```bash
npm run seed
```

This command executes the `loadDB.ts` script, which:

- Extracts content from the PDF file.
- Generates vector embeddings using OpenAI.
- Stores the embeddings in **AstraDB**.

### 6. Start the Development Server

Once embeddings are stored, start the chatbot by running:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the chatbot in action.

## Learn More

To understand the technologies used, check out these resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [DataStax AstraDB](https://www.datastax.com/products/datastax-astra) - Learn about serverless vector databases.
- [OpenAI API](https://openai.com/) - Learn how OpenAI API works.

---

Now you’re all set to develop and test your **STREAMBot Chatbot** locally! 🚀
