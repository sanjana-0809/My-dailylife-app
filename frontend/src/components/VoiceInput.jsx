// components/VoiceInput.jsx - Microphone button + recording interface
import React, { useState } from 'react';
import { FiMic, FiSquare, FiX, FiSend } from 'react-icons/fi';
import { useVoice } from '../hooks/useVoice';
import { useRemindersContext } from '../context/RemindersContext';
import { formatDuration } from '../utils/formatDate';
import toast from 'react-hot-toast';
import Button from './Common/Button';

const VoiceInput = () => {
  const { isRecording, audioBlob, duration, error, startRecording, stopRecording, resetRecording } = useVoice();
  const { createVoiceReminder } = useRemindersContext();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    if (!audioBlob) return;
    setSending(true);
    try {
      const data = await createVoiceReminder(audioBlob);
      setResult(data);
      toast.success(`Reminder created: "${data.title}"`);
      setTimeout(() => {
        resetRecording();
        setResult(null);
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to process voice note';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  // ─── Recording State ───
  if (isRecording) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 animate-slide-up">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <button
              onClick={stopRecording}
              className="w-20 h-20 bg-accent-red text-white rounded-full flex items-center justify-center recording-active transition-transform hover:scale-105"
              aria-label="Stop recording"
            >
              <FiSquare size={28} />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-accent-red">Recording...</p>
            <p className="text-2xl font-mono font-bold text-gray-800 mt-1">{formatDuration(duration)}</p>
          </div>
          <p className="text-xs text-gray-400">Tap the button to stop recording</p>
        </div>
      </div>
    );
  }

  // ─── Review & Send State ───
  if (audioBlob) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-6 animate-slide-up">
        {result ? (
          <div className="text-center space-y-2">
            <div className="text-3xl">✅</div>
            <p className="font-semibold text-gray-800">{result.title}</p>
            <p className="text-sm text-gray-500">
              Due: {result.due_date} at {result.due_time}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Voice note recorded</p>
              <p className="text-xs text-gray-400">{formatDuration(duration)} — Ready to send</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetRecording} disabled={sending}>
                <FiX size={16} />
              </Button>
              <Button size="sm" onClick={handleSend} loading={sending}>
                <FiSend size={14} />
                {sending ? 'Processing...' : 'Create Reminder'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Default State (Mic Button) ───
  return (
    <div className="flex flex-col items-center gap-3">
      {error && (
        <div className="bg-red-50 text-accent-red text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      <button
        onClick={startRecording}
        className="group w-16 h-16 bg-brand-500 hover:bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-brand-500/40 active:scale-95"
        aria-label="Start voice recording"
      >
        <FiMic size={24} className="group-hover:scale-110 transition-transform" />
      </button>
      <p className="text-xs text-gray-400 font-medium">Tap to speak your reminder</p>
    </div>
  );
};

export default VoiceInput;
