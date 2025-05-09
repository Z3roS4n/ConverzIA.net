import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart'; // Import the multipart plugin
import dotenv from 'dotenv';
import OpenAIClient from './openaiApi.js';
import fs from 'fs';
const languagePresets = fs.readFileSync('./config.json', 'utf-8');
const parsedLanguagePresets = JSON.parse(languagePresets).languages;
console.log("Lingue supportate:", parsedLanguagePresets); // Logga le lingue supportate
dotenv.config();
const openai = new OpenAIClient(process.env.OPENAI_API_KEY || '');
const fastify = Fastify({ logger: true });
async function startServer() {
    await fastify.register(cors, { origin: '*', methods: ['GET', 'POST', 'OPTIONS'] });
    await fastify.register(multipart); // Register the multipart plugin
    fastify.post('/translate', async (request, reply) => {
        try {
            const isMultipart = request.isMultipart(); // Estrai il corpo della richiesta
            if (isMultipart) { // Controlla se la richiesta è multipart
                const data = await request.file(); // Estrai il file dalla richiesta multipart
                if (!data) {
                    console.log('No file uploaded!');
                    return reply.status(400).send({ error: 'No file uploaded' });
                }
                const fileBuffer = await data?.toBuffer(); // Ottieni il buffer del file
                const fileType = data?.mimetype;
                const languageField = data?.fields.language; // Estrai il campo 'language' dalla richiesta multipart
                const language = languageField?.value || 'en';
                //contenuto della richiesta 
                console.log("Selected language inviato nella richiesta :", language);
                console.log("Uploaded file type:", fileType);
                console.log("Uploaded file size:", fileBuffer?.length);
                // Passa il buffer e il tipo MIME al metodo transcribeAudio
                if (!fileBuffer)
                    throw new Error('File buffer is undefined');
                if (!fileType)
                    throw new Error('File type is undefined');
                if (!parsedLanguagePresets[language])
                    throw new Error(`Language ${language} not supported!`);
                const transcript = await openai.transcribeAudio(fileBuffer, fileType);
                console.log("Transcription:", transcript);
                const translation = await openai.getChatResponse(parsedLanguagePresets[language] + transcript);
                console.log("Translation:", translation);
                return reply.send({ translation, transcript });
            }
            else {
                //SOLO TESTO
                const data = await request.body; // Explicitly type the body
                const text = data.text; // Estrai il campo 'text' dalla richiesta
                const language = data.language; // Estrai il campo 'language' dalla richiesta
                if (!parsedLanguagePresets[language])
                    throw new Error(`Language ${language} not supported!`);
                if (!text)
                    throw new Error('Text is undefined!');
                console.log("Selected language inviato nella richiesta :", language);
                console.log("Text to translate:", text);
                const translation = await openai.getChatResponse(parsedLanguagePresets[language] + text);
                console.log("Translation:", translation);
                return reply.send({ translation });
            }
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
