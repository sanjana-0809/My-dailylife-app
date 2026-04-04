// pages/Today.jsx - Today's reminders + habits dashboard
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useRemindersContext } from '../context/RemindersContext';
import { useHabits } from '../hooks/useHabits';
import { useAuth } from '../hooks/useAuth';
import VoiceInput from '../components/VoiceInput';
import ReminderCard from '../components/ReminderCard';
import HabitTracker from '../components/HabitTracker';
import CreateReminder from '../components/Modals/CreateReminder';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';
import api from '../services/api';

const Today = () => {
  const { user } = useAuth();
  const { todayReminders, fetchToday, loading: remLoading } = useRemindersContext();
  const { habits, fetchHabits, markComplete: markHabitComplete, deleteHabit, loading: habLoading } = useHabits();
  const [showCreate, setShowCreate] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchToday();
    fetchHabits();

    // Fetch dashboard stats
    api.get('/dashboard').then(({ data }) => {
      setStats(data.stats);
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const greeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name?.split(' ')[0] || '';
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 17) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const loading = remLoading || habLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{greeting()}</h2>
          <p className="text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="md">
          <FiPlus size={16} /> New Reminder
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Active', value: stats.active_reminders, color: 'text-brand-500' },
            { label: 'Completed', value: stats.completed_this_week, color: 'text-accent-green' },
            { label: 'Habits', value: stats.total_habits, color: 'text-accent-purple' },
            { label: 'Best Streak', value: `${stats.best_streak}d`, color: 'text-accent-amber' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-surface-200 p-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Voice Input */}
      <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-6 border border-brand-100">
        <VoiceInput />
      </div>

      {loading ? (
        <Loading text="Loading your day..." />
      ) : (
        <>
          {/* Today's Reminders */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Today's Reminders
              {todayReminders.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">({todayReminders.length})</span>
              )}
            </h3>
            {todayReminders.length === 0 ? (
              <EmptyState icon="📋" title="No reminders today" description="Use voice input or create a reminder to get started" />
            ) : (
              <div className="space-y-2">
                {todayReminders.map((r) => (
                  <ReminderCard key={r.id} reminder={r} />
                ))}
              </div>
            )}
          </section>

          {/* Daily Habits */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Habits
              {habits.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({habits.filter((h) => h.completed_today).length}/{habits.length} done)
                </span>
              )}
            </h3>
            {habits.length === 0 ? (
              <EmptyState icon="✅" title="No habits yet" description="Create daily habits to build streaks" />
            ) : (
              <div className="space-y-2">
                {habits.map((h) => (
                  <HabitTracker key={h.id} habit={h} onComplete={markHabitComplete} onDelete={deleteHabit} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {showCreate && <CreateReminder onClose={() => setShowCreate(false)} />}
    </div>
  );
};

export default Today;
