import { tools } from "@/ai/tools";
import { openai } from "@ai-sdk/openai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, createUIMessageStreamResponse, generateText, isStepCount, Output, streamText, tool, toUIMessageStream } from "ai";
import { NextRequest, NextResponse } from "next/server";
 
/*****  USANDO STREAMING *****/
export async function POST(request: NextRequest){
    const { messages } = await request.json();

    const result = streamText({
        model:  openai('gpt-4o'), // openrouter.chat('openai/gpt-4o-latest'),
        tools,
        messages: await convertToModelMessages(messages),
        stopWhen : isStepCount(3),
        // toolChoice: true, // só responde comandos relacionados as tools
        system: `
            Sempre responda em markdown sem aspas no ínicio ou fim da mensagem.
        `,
    })

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    })
}

/******* USANDO FUNÇÃO PARA GERAR TEXTO COM OPENAI *******/
// export async function GET(request: NextRequest){
//     const result = await generateText({
//         model:  openai('gpt-4o'),
//         prompt:'Traduza Hello World para português!',
//         system: 'Você é uma IA especializada em tradução, sempre retorne da maneira mais sucinta possível.'
//     })

//     return NextResponse.json({ message: result.text})
// }

/******* USANDO OPENROUTER -> ROTEADOR DE MODELOS LLM DE IA --> https://openrouter.ai/ *******/
// export async function GET(request: NextRequest){
//     const result = await generateText({
//         model:  openrouter.chat('openai/chatgpt-4o-latest'),
//         prompt:'Traduza Hello World para português!',
//         system: 'Você é uma IA especializada em tradução, sempre retorne da maneira mais sucinta possível.'
//     })

//     return NextResponse.json({ message: result.text})
// }


/******* USANDO GENERATE OBJECT *******/
// export async function GET(request: NextRequest){
//     /* DEPRECIADO
//         const result = await generateObject({
//             model:  openrouter.chat('openai/gpt-4o-latest'),
//             schema: z.object({
//                 traducao: z.object({
//                     pt: z.string().describe('Tradução para portugês'),
//                     fr: z.string().describe('Tradução para francês'),
//                     es: z.string().describe('Tradução para espanhol')
//                 })
//             }),
//             prompt:'Traduza Hello World para português!',
//             system: 'Você é uma IA especializada em tradução, sempre retorne da maneira mais sucinta possível.'
//         })
//     */

//    // NOVA FORMA DE USAR O GENERATE OBJECT
//    const result = await generateText({
//         model:  openrouter.chat('openai/gpt-4o-latest'),
//         output: Output.object({
//             schema: z.object({
//                 traducao: z.object({
//                     pt: z.string().describe('Tradução para portugês'),
//                     fr: z.string().describe('Tradução para francês'),
//                     es: z.string().describe('Tradução para espanhol')
//                 })
//             }),
//         }),
//         prompt:'Traduza Hello World para português!',
//         system: 'Você é uma IA especializada em tradução, sempre retorne da maneira mais sucinta possível.'
//     })
    
//     return NextResponse.json({ message: result.output })
// }

/***** USANDO TOOLING  *****/
// export async function GET(request: NextRequest){
//     const result = await generateText({
//         model:  openrouter.chat('openai/gpt-4o-latest'),
//         tools:{
//             profileAndUrls: tool({
//                 description: 'Essa ferramenta serve para buscar dados de um usário no GitHub ou acessar URLs da API para outras informações de um usuário como lista de organizações, repositórios e etc...',
//                 inputSchema: z.object({
//                     username: z.string().describe('Username do usuário no github'),
//                 }),
//                 execute: async ({ username }) => {
//                     const response = await fetch(`https://api.github.com/users/${username}`)
//                     const data = await response.json()

//                     return JSON.stringify(data)
//                 }
//             }),
//             fetchHTTP: tool({
//                 description: 'Essa ferramenta server para realizar uma requisação HTTP em uma URL especificada e acessar sua resposta',
//                 inputSchema: z.object({
//                     url: z.url().describe('URK a ser requisitada'),
//                 }),
//                 execute: async ({ url }) => {
//                     const response = await fetch(url)
//                     const data = await response.text()

//                     return data
//                 }
//             })
//         },
//         prompt:'Quantos repositórios públicos o usuário victor-MT possui no Github?',
//         stopWhen : isStepCount(5),
//         onStepEnd: ({ toolResults }) => {
//             console.log(toolResults)
//         }
//     })

//     return NextResponse.json({ message: result.text, parts: result.toolResults })
// }

