import OpenAI from "openai"
import { openai } from '@ai-sdk/openai';
import { streamText } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts"

const { ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY 
} = process.env

const openaiClient = new OpenAI({
    apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)

const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace : ASTRA_DB_NAMESPACE })



export async function POST(req: Request){
    try{
        const { messages } = await req.json()
        const latestMessage = messages[messages.length - 1]?.content

        let docContext = ""

        const embedding = await openaiClient.embeddings.create({
            model: "text-embedding-3-small",
            input: latestMessage,
            encoding_format: "float"
        })

        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor = collection.find(null,{
                sort:{
                $vector: embedding.data[0].embedding,
            },
        limit: 10        
        })

        const documents = await cursor.toArray()

        const docsMap = documents?.map(doc => doc.text)

        docContext = JSON.stringify(docsMap)
        } catch(err) {
            console.log("error querying db")
            docContext = ""
        }
         

        
        const template = {
            role: "system",
            content: ` You are an AI assistant who knows everything about Stream Ecosystem. 
            Use the below context to augment what you know about Stream Ecosystem. 
            The context will provide you with detailed information on the Stream Ecosystem Website along with the Learning 
            Management System and Project Based Learning. It contains all procedures to follow in both LMS and PBL.
            It contains troubleshooting steps for common issues and a list of FAQs. It also contains customised greetings
            and responses to user queries also some random facts that you can maybe use to respond. 
            If the context doesn't include the information you need answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include. 
            Format responses using markdown where applicable and don't return images.
        ---------------
        START OF CONTEXT

        ${docContext}

        END OF CONTEXT
        ---------------

        QUESTION: ${latestMessage}
        ---------------`
        }

        const result = streamText({
            model: openai('gpt-3.5-turbo'),
            messages: [template, ... messages]
        });

        return result.toDataStreamResponse();

    } catch(err) {
        throw err
    }
}