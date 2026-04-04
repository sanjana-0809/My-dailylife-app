// hooks/useHabits.js - Habits data hook
import { useState, useCallback } from 'react';
import api from '../services/api';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/habits');
      setHabits(data);
    } catch (err) {
      console.error('Failed to fetch habits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createHabit = useCallback(async (habitData) => {
    const { data } = await api.post('/habits', habitData);
    setHabits((prev) => [...prev, data]);
    return data;
  }, []);

  const markComplete = useCallback(async (id) => {
    const { data } = await api.patch(`/habits/${id}/complete`);
    setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
    return data;
  }, []);

  const updateHabit = useCallback(async (id, updates) => {
    const { data } = await api.patch(`/habits/${id}`, updates);
    setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
    return data;
  }, []);

  const deleteHabit = useCallback(async (id) => {
    await api.delete(`/habits/${id}`);
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  return { habits, loading, fetchHabits, createHabit, markComplete, updateHabit, deleteHabit };
};
