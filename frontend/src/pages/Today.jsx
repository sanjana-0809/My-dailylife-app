import React, { useEffect, useState } from 'react';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import { format, addDays, subDays, isToday, startOfWeek } from 'date-fns';
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
import { formatTime } from '../utils/formatDate';
import api from '../services/api';

const Today = () => {
  const { user } = useAuth();
  const { todayReminders, fetchToday, loading: remLoading } = useRemindersContext();
  const { habits, fetchHabits, markComplete: markHabitComplete, deleteHabit, loading: habLoading } = useHabits();
  const [showCreate, setShowCreate] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showVoice, setShowVoice] = useState(false);

  useEffect(() => {
    fetchToday();
    fetchHabits();
    api.get('/dashboard').then(({ data }) => setStats(data.stats)).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate week dates for the date strip
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const loading = remLoading || habLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white font-display">My Tasks</h2>
        </div>
        <button onClick={() => setShowCreate(true)} className="p-2 rounded-xl hover:bg-surface-light text-gray-400 hover:text-gray-200 transition-colors">
          <FiPlus size={22} />
        </button>
      </div>

      {/* Month Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold text-white font-display">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <FiChevronDown size={18} className="text-dark-300" />
      </div>

      {/* Date Strip — horizontal scrollable week */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {weekDates.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isTodayDate = isToday(date);
          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all duration-200
                ${isSelected
                  ? 'bg-brand-green text-dark-900 shadow-lg shadow-brand-green/30 scale-105'
                  : 'bg-surface-mid text-gray-400 hover:bg-surface-light border border-dark-500'
                }`}
            >
              <span className={`text-2xl font-bold ${isSelected ? 'text-dark-900' : 'text-gray-200'}`}>
                {format(date, 'd')}
              </span>
              <span className={`text-xs font-medium mt-0.5 ${isSelected ? 'text-dark-700' : 'text-dark-300'}`}>
                {format(date, 'EEE')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Voice Input Toggle */}
      <div className="bg-surface-mid rounded-2xl border border-dark-500 overflow-hidden">
        <button
          onClick={() => setShowVoice(!showVoice)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-light transition-colors"
        >
          <div className="w-10 h-10 bg-brand-green/15 rounded-xl flex items-center justify-center">
            <span className="text-brand-green text-lg">🎤</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-200">Voice Reminder</p>
            <p className="text-xs text-dark-300">Tap to speak your reminder</p>
          </div>
        </button>
        {showVoice && (
          <div className="p-4 border-t border-dark-500">
            <VoiceInput />
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Active', value: stats.active_reminders, color: 'text-brand-green' },
            { label: 'Done', value: stats.completed_this_week, color: 'text-brand-cyan' },
            { label: 'Habits', value: stats.total_habits, color: 'text-card-purple' },
            { label: 'Streak', value: `${stats.best_streak}d`, color: 'text-brand-green' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-mid rounded-2xl border border-dark-500 p-3 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-semibold text-dark-300 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <Loading text="Loading tasks..." />
      ) : (
        <>
          {/* Timeline View */}
          <section>
            <h3 className="text-sm font-bold text-dark-300 uppercase tracking-wider mb-4">Today's Schedule</h3>
            {todayReminders.length === 0 ? (
              <EmptyState icon="📋" title="No tasks today" description="Use voice input or tap + to add a reminder"
                action={<Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Add Task</Button>} />
            ) : (
              <div className="space-y-4">
                {todayReminders.map((r, i) => (
                  <div key={r.id} className="flex gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    {/* Time column */}
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                      <span className="text-xs font-semibold text-dark-300">{formatTime(r.due_time)}</span>
                      {i < todayReminders.length - 1 && <div className="flex-1 w-0 border-l-2 border-dashed border-dark-500 mt-2" />}
                    </div>
                    {/* Card */}
                    <div className="flex-1 pb-2">
                      <ReminderCard reminder={r} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Habits */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-dark-300 uppercase tracking-wider">Habits</h3>
              {habits.length > 0 && (
                <span className="text-xs font-bold text-brand-green">
                  {habits.filter(h => h.completed_today).length}/{habits.length}
                </span>
              )}
            </div>
            {habits.length === 0 ? (
              <EmptyState icon="✅" title="No habits yet" description="Build daily routines" />
            ) : (
              <div className="space-y-2">
                {habits.map((h, i) => (
                  <div key={h.id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <HabitTracker habit={h} onComplete={markHabitComplete} onDelete={deleteHabit} />
                  </div>
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
