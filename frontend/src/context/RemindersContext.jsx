// context/RemindersContext.jsx - Reminders state management
import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const RemindersContext = createContext(null);

export const RemindersProvider = ({ children }) => {
  const [reminders, setReminders] = useState([]);
  const [todayReminders, setTodayReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReminders = useCallback(async (status) => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const { data } = await api.get('/reminders', { params });
      setReminders(data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchToday = useCallback(async () => {
    try {
      const { data } = await api.get('/reminders/today');
      setTodayReminders(data.reminders);
    } catch (err) {
      console.error('Failed to fetch today reminders:', err);
    }
  }, []);

  const createReminder = useCallback(async (reminderData) => {
    const { data } = await api.post('/reminders', reminderData);
    setReminders((prev) => [...prev, data].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
    return data;
  }, []);

  const createVoiceReminder = useCallback(async (audioBlob) => {
    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'recording.webm');
    const { data } = await api.post('/reminders/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setReminders((prev) => [...prev, data].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
    return data;
  }, []);

  const markComplete = useCallback(async (id) => {
    const { data } = await api.patch(`/reminders/${id}/mark-complete`);
    setReminders((prev) => prev.map((r) => (r.id === id ? data : r)));
    setTodayReminders((prev) => prev.map((r) => (r.id === id ? data : r)));
    return data;
  }, []);

  const updateReminder = useCallback(async (id, updates) => {
    const { data } = await api.patch(`/reminders/${id}`, updates);
    setReminders((prev) => prev.map((r) => (r.id === id ? data : r)));
    return data;
  }, []);

  const deleteReminder = useCallback(async (id) => {
    await api.delete(`/reminders/${id}`);
    setReminders((prev) => prev.filter((r) => r.id !== id));
    setTodayReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <RemindersContext.Provider
      value={{
        reminders, todayReminders, loading,
        fetchReminders, fetchToday, createReminder,
        createVoiceReminder, markComplete, updateReminder, deleteReminder,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export const useRemindersContext = () => {
  const context = useContext(RemindersContext);
  if (!context) throw new Error('useRemindersContext must be used within RemindersProvider');
  return context;
};
