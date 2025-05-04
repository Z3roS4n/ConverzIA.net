import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import OpenAIClient from './openaiApi.js';
dotenv.config();
const openai = new OpenAIClient(process.env.OPENAI_API_KEY || '');
const fastify = Fastify({ logger: true });
async function startServer() {
    await fastify.register(cors, { origin: '*', methods: ['GET', 'POST', 'OPTIONS'] });
    fastify.post('/translate', async (request, reply) => {
        const chunks = [];
        // Collect all the incoming chunks (audio file)
        for await (const chunk of request.raw) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);
        try {
            // Process audio buffer (transcription and translation)
            const text = await openai.transcribeAudio(audioBuffer);
            const translation = await openai.getChatResponse(text);
            return { translation };
        }
        catch (error) {
            console.error('Error processing the audio:', error);
            return reply.status(500).send({ error: 'Failed to process audio' });
        }
    });
    try {
        await fastify.listen({ port: 3000 });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
startServer();
