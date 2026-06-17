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
      setTimeout(() => { resetRecording(); setResult(null); }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to process voice note');
    } finally { setSending(false); }
  };

  if (isRecording) {
    return (
      <div className="bg-surface-mid rounded-2xl border border-red-500/30 p-6 animate-slide-up">
        <div className="flex flex-col items-center gap-4">
          <button onClick={stopRecording}
            className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center recording-active transition-transform hover:scale-105"
          >
            <FiSquare size={28} />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-red-400">Recording...</p>
            <p className="text-3xl font-mono font-bold text-white mt-1">{formatDuration(duration)}</p>
          </div>
          <p className="text-xs text-dark-300">Tap to stop</p>
        </div>
      </div>
    );
  }

  if (audioBlob) {
    return (
      <div className="bg-surface-mid rounded-2xl border border-dark-500 p-5 animate-slide-up">
        {result ? (
          <div className="text-center space-y-2">
            <div className="text-3xl">✅</div>
            <p className="font-semibold text-white">{result.title}</p>
            <p className="text-sm text-dark-300">Due: {result.due_date} at {result.due_time}</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-200">Voice note ready</p>
              <p className="text-xs text-dark-300">{formatDuration(duration)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={resetRecording} disabled={sending}><FiX size={16} /></Button>
              <Button size="sm" onClick={handleSend} loading={sending}>
                <FiSend size={14} /> {sending ? 'Processing...' : 'Create'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {error && <div className="bg-red-500/10 text-red-400 text-sm px-4 py-2 rounded-xl border border-red-500/20">{error}</div>}
      <button onClick={startRecording}
        className="group w-16 h-16 bg-brand-green text-dark-900 rounded-full flex items-center justify-center shadow-lg shadow-brand-green/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-brand-green/40 active:scale-95"
      >
        <FiMic size={24} className="group-hover:scale-110 transition-transform" />
      </button>
      <p className="text-xs text-dark-300 font-medium">Tap to speak your reminder</p>
    </div>
  );
};

export default VoiceInput;
