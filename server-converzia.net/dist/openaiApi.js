import OpenAI from 'openai';
import * as fs from 'fs';
class OpenAIClient {
    constructor(apiKey) {
        this.openai = new OpenAI({ apiKey });
    }
    async getChatResponse(prompt) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
            });
            if (!response.choices[0].message.content) {
                throw new Error('Response content is null');
            }
            return response.choices[0].message.content;
        }
        catch (error) {
            console.error('Error fetching chat response:', error);
            throw error;
        }
    }
    async transcribeAudio(audioBuffer, fileType) {
        try {
            const supportedFormats = ['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
            if (!supportedFormats.includes(fileType)) {
                throw new Error(`File format (${fileType}) not supported. Supported formats are: ${supportedFormats.join(', ')}`);
            }
            const extension = fileType.split('/')[1]; // Ottieni l'estensione dal tipo MIME
            const tempFilePath = `./temp-audio.${extension}`;
            fs.writeFileSync(tempFilePath, audioBuffer);
            const response = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: 'whisper-1',
                response_format: 'text',
                language: 'it',
            });
            fs.unlinkSync(tempFilePath); // Pulisci il file temporaneo
            if (!response) {
                throw new Error('Transcription response is null');
            }
            return response;
        }
        catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }
}
export default OpenAIClient;
