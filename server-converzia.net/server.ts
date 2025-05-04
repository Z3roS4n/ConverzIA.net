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
            const data = await request.file(); // Estrai il file dalla richiesta multipart
            if (!data) {
                throw new Error('No file uploaded');
            }
            const fileBuffer = await data.toBuffer(); // Ottieni il buffer del file
            const fileType = data.mimetype; // Ottieni il tipo MIME del file

            const languageField = data.fields.language as any; // Estrai il campo 'language' dalla richiesta multipart
            const language = languageField?.value || 'en';

            //contenuto della richiesta 
            console.log("Selected language inviato nella richiesta :", language); // Logga il valore della lingua selezionata
            console.log("Uploaded file type:", fileType); // Logga il tipo MIME
            console.log("Uploaded file size:", fileBuffer.length); // Logga la dimensione del file
    
            // Passa il buffer e il tipo MIME al metodo transcribeAudio
            const text = await openai.transcribeAudio(fileBuffer, fileType);
            console.log("Transcription:", text); // Logga la trascrizione
            const translation = await openai.getChatResponse(parsedLanguagePresets[language] + text); // Passa il testo trascritto al metodo getChatResponse
            console.log("Translation:", translation); // Logga la traduzione
    
            return reply.send({ translation, text });
        } catch (error) {
            console.error('Error processing the audio:', error);
            return reply.status(500).send({ error: 'Failed to process audio' });
        }
    });
    
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

startServer();