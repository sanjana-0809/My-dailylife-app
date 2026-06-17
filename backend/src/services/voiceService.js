// services/voiceService.js - Groq Whisper transcription
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let groq = null;

const getClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.startsWith('gsk_your')) {
      console.warn('[Whisper] Groq API key not configured — voice transcription disabled');
      return null;
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

const transcribeAudio = async (filePath) => {
  const client = getClient();

  if (!client) {
    throw new Error('Groq API key not configured. Set GROQ_API_KEY in .env');
  }

  let renamedPath = null;

  try {
    console.log('[Whisper] Transcribing via Groq:', filePath);

    // Groq requires a proper file extension — rename the temp file
    renamedPath = filePath + '.webm';
    fs.copyFileSync(filePath, renamedPath);

    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: 'whisper-large-v3',
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
    // Clean up both files
    try { fs.unlinkSync(filePath); } catch (_) {}
    try { if (renamedPath) fs.unlinkSync(renamedPath); } catch (_) {}
  }
};

module.exports = { transcribeAudio };