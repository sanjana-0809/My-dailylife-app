// services/voiceService.js - OpenAI Whisper transcription
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

let openai = null;

/**
 * Initialize OpenAI client (lazy — only when first needed).
 */
const getClient = () => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-your')) {
      console.warn('[Whisper] OpenAI API key not configured — voice transcription disabled');
      return null;
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

/**
 * Transcribe an audio file using OpenAI Whisper API.
 * @param {string} filePath - Path to the audio file on disk
 * @returns {Promise<string>} Transcribed text
 */
const transcribeAudio = async (filePath) => {
  const client = getClient();

  if (!client) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env');
  }

  try {
    console.log('[Whisper] Transcribing:', filePath);

    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: 'en',
      response_format: 'text',
    });

    const text = typeof transcription === 'string' ? transcription : transcription.text;
    console.log('[Whisper] Result:', text);
    return text.trim();
  } catch (err) {
    console.error('[Whisper] Transcription failed:', err.message);
    throw new Error(`Voice transcription failed: ${err.message}`);
  } finally {
    // Clean up uploaded temp file
    try {
      fs.unlinkSync(filePath);
    } catch (_) {}
  }
};

module.exports = { transcribeAudio };
