<h1>CONVERZIA.NET WEBSITE</h1>

Website I created for an high school project.
Essentially, it's a simple website which interfaces with a server (code is <i>actually</i> private for technical reasons);
When a user writes a text or record an audio, the data is sent to the server, then is processed:
<ol>
  <li>If the sent data is a <b>simple text</b>: It's sent to OpenAI GPT API for translation (with well configured predefined prompts)</li>
  <li>If the sent data is an <b>audio file</b>: It's sent to OpenAI Whisper-1 API in order to transcript the whole audio file, then it's processed as said before (sent to OpenAI for translation)</li>
</ol>

When the response from server is ready, the "translated text" box will be updated with translated text, and if the sent data is an audio file, also the "original text" box will be updated, but it will contain the audio transcription.
If the user want, it's possible to listen the response, thanks to Speech Synthesis.

<h3>TRY IT SETTINGS</h3>

In order to increase the UX, I provided some settings options to improve the capability of personalizing results (still remaining simple as f*ck):
<ol>
  <li><b>Transcription Language</b>: Capability to change the user default language for transcription, in order to improve transcription quality (default: Italian)</li>
  <li><b>Auto Translation</b>: When this option is set to Enabled, every time the user write a character, the whole text is sent to server for processing; this option guarantee a faster (much faster) translation, because delete the user click-to-translate step. (default: Enabled)</li>
</ol>
