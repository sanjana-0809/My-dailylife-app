// services/voiceService.js - Groq Whisper transcription
const Groq = require('groq-sdk');
const fs = require('fs');
require('dotenv').config();

let groq = null;

/** Whether a usable Groq API key is configured. */
const isVoiceConfigured = () => {
  const key = process.env.GROQ_API_KEY;
  return !!key && !key.startsWith('gsk_your');
};

const getClient = () => {
  if (!groq) {
    if (!isVoiceConfigured()) {
      console.warn('[Whisper] Groq API key not configured — voice transcription disabled');
      return null;
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

// Map upload mimetypes to the file extension Groq/Whisper expects.
const MIME_TO_EXT = {
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/wave': 'wav',
  'audio/mp3': 'mp3',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/m4a': 'm4a',
  'audio/x-m4a': 'm4a',
};

/**
 * Transcribe an audio file via Groq Whisper.
 * @param {string} filePath - Path to the uploaded temp file
 * @param {string} mimetype - Original upload mimetype (to pick the right extension)
 * @returns {Promise<string>} Transcribed text (may be empty)
 * @throws Error with statusCode 503 (not configured) or 502 (transcription failed)
 */
const transcribeAudio = async (filePath, mimetype = 'audio/webm') => {
  const client = getClient();

  if (!client) {
    const err = new Error('Voice transcription is not set up on the server.');
    err.statusCode = 503;
    throw err;
  }

  let renamedPath = null;

  try {
    // Groq detects format from the extension — derive it from the real mimetype
    const ext = MIME_TO_EXT[mimetype] || 'webm';
    renamedPath = `${filePath}.${ext}`;
    fs.copyFileSync(filePath, renamedPath);
    console.log(`[Whisper] Transcribing via Groq (${ext}):`, filePath);

    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: 'whisper-large-v3',
      language: 'en',
      response_format: 'text',
    });

    const text = typeof transcription === 'string' ? transcription : transcription.text;
    console.log('[Whisper] Result:', text);
    return (text || '').trim();
  } catch (err) {
    console.error('[Whisper] Transcription failed:', err.message);
    const e = new Error('Voice transcription failed. Please try again.');
    e.statusCode = 502;
    throw e;
  } finally {
    // Clean up both files
    try { fs.unlinkSync(filePath); } catch (_) {}
    try { if (renamedPath) fs.unlinkSync(renamedPath); } catch (_) {}
  }
};

module.exports = { transcribeAudio, isVoiceConfigured };
