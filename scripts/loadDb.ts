import { DataAPIClient } from "@datastax/astra-db-ts"
import OpenAI from "openai"

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import "dotenv/config" // Load environment variables from a .env file
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

const { ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY 
} = process.env

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)

const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace : ASTRA_DB_NAMESPACE })

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 100
})

const createCollection = async (similarityMetric : SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: similarityMetric
        }
    })
    console.log(res)
}

const loadSampleData = async () => {
    const pdfPath = path.join(process.cwd(), 'pdfs', 'Chatbot_RAGdata.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdfParse(pdfBuffer);
    const content = pdfData.text;

    const chunks = await splitter.splitText(content);
    const collection = await db.collection(ASTRA_DB_COLLECTION);

    for await (const chunk of chunks) {
        const embeddings = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
            encoding_format: "float"
        });

        const vector = embeddings.data[0].embedding;

        const res = await collection.insertOne({
            $vector: vector,
            text: chunk
        });
        console.log(res);
    }
};    

createCollection().then(() => loadSampleData())