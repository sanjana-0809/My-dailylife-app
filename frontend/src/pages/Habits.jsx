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

  useEffect(() => { fetchHabits(); }, []); // eslint-disable-line

  const completedCount = habits.filter(h => h.completed_today).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white font-display">Habits</h2>
        <Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> New</Button>
      </div>

      {total > 0 && (
        <div className="bg-surface-mid rounded-2xl border border-dark-500 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-300">Today's Progress</span>
            <span className="text-sm font-bold text-brand-green">{completedCount}/{total}</span>
          </div>
          <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-green to-brand-cyan rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          {pct === 100 && <p className="text-sm text-brand-green font-semibold mt-3 text-center">All done today! 🎉</p>}
        </div>
      )}

      {loading ? <Loading text="Loading habits..." /> : habits.length === 0 ? (
        <EmptyState icon="✅" title="No habits yet" description="Build daily routines"
          action={<Button onClick={() => setShowCreate(true)} size="sm"><FiPlus size={14} /> Create</Button>} />
      ) : (
        <div className="space-y-2">{habits.map(h => <HabitTracker key={h.id} habit={h} onComplete={markComplete} onDelete={deleteHabit} />)}</div>
      )}
      {showCreate && <CreateHabit onClose={() => setShowCreate(false)} onCreate={createHabit} />}
    </div>
  );
};

export default Habits;
