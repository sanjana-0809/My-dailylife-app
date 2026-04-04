// pages/Habits.jsx - Habits tracking view
import React, { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useHabits } from '../hooks/useHabits';
import HabitTracker from '../components/HabitTracker';
import CreateHabit from '../components/Modals/CreateHabit';
import Loading from '../components/Common/Loading';
import EmptyState from '../components/Common/EmptyState';
import Button from '../components/Common/Button';

const Habits = () => {
  const { habits, loading, fetchHabits, createHabit, markComplete, deleteHabit } = useHabits();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const completedCount = habits.filter((h) => h.completed_today).length;
  const totalCount = habits.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Habits</h2>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <FiPlus size={14} /> New Habit
        </Button>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Today's Progress</span>
            <span className="text-sm font-bold text-brand-500">{completedCount}/{totalCount}</span>
          </div>
          <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-accent-green rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct === 100 && (
            <p className="text-sm text-accent-green font-medium mt-2 text-center">All habits complete today! 🎉</p>
          )}
        </div>
      )}

      {loading ? (
        <Loading text="Loading habits..." />
      ) : habits.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No habits yet"
          description="Start building daily routines by creating your first habit"
          action={<Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Create Habit</Button>}
        />
      ) : (
        <div className="space-y-2">
          {habits.map((h) => (
            <HabitTracker key={h.id} habit={h} onComplete={markComplete} onDelete={deleteHabit} />
          ))}
        </div>
      )}

      {showCreate && <CreateHabit onClose={() => setShowCreate(false)} onCreate={createHabit} />}
    </div>
  );
};

export default Habits;
