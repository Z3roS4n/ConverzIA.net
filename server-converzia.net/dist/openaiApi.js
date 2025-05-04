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
    async transcribeAudio(audioBuffer) {
        try {
            const tempFilePath = './temp-audio.webm';
            fs.writeFileSync(tempFilePath, audioBuffer);
            const response = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(tempFilePath),
                model: 'whisper-1',
                response_format: 'text',
                // `filename` is required to infer MIME type correctly
            });
            fs.unlinkSync(tempFilePath); // Clean up the temporary file
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
