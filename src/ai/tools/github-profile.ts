import { github } from "@/lib/octokit"
import { tool } from "ai"
import { setTimeout } from "timers/promises"
import z from "zod"


export const githubProfile = tool({
    description: 'Essa ferramenta serve para buscar dados de um usário no GitHub ou acessar URLs da API para outras informações de um usuário como lista de organizações, repositórios e etc...',
    inputSchema: z.object({
        username: z.string().describe('Username do usuário no github'),
    }),
    execute: async ({ username }) => {
        const response = await github.users.getByUsername({username})
        return response.data
    }
})