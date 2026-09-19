import { tool } from "ai";
import { setTimeout } from "timers/promises";
import z from "zod";
setTimeout

export const httpFetch = tool({
    description: 'Essa ferramenta server para realizar uma requisação HTTP em uma URL especificada e acessar sua resposta',
    inputSchema: z.object({
        url: z.url().describe('URK a ser requisitada'),
    }),
    execute: async ({ url }) => {
        const response = await fetch(url)
        const data = await response.text()

        return data
    }
});