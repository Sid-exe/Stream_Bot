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
            console.error("error querying db",err)
            docContext = ""
        }
         

        
        const template = {
            role: "system",
            content: `You are an AI assistant specializing in the Stream Ecosystem. 
        Use the provided context as the primary reference for answering queries about the Stream Ecosystem Website, 
        including the Learning Management System (LMS) and Project-Based Learning (PBL). The context contains detailed 
        procedures, troubleshooting steps, FAQs, customized greetings, and general responses.
        
        If the context does not include the required information, Just mention that You can only provide information that
        answers queries about the Stream Ecosystem Initiative and its functions, including the Learning Management System (LMS) and Project-Based Learning (PBL).

        If the response is too large, limit the output words and answer in concise sentences.
        
        ### Response Formatting:
        1. If the question requires step-by-step guidance, each step must be placed on a **separate line** without merging multiple points into a paragraph.  
        2. Avoid using symbols like dashes, asterisks, or numbering that might affect text structure.  
        3. Leave an empty line between each step to improve readability.  
        4. For troubleshooting, follow this approach:  
           Identify the issue  
           
           Suggest potential causes  
           
           Provide a step-by-step solution  
        
        5. For general queries, respond concisely while maintaining readability.  
        6. Do not include images in responses.  
        7. Avoid speculation—if you lack sufficient information, state that the answer is unavailable.  
        
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