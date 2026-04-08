import React from 'react';
import { BuildGoals as BuildGoalsType, ActivityType } from '../types';
import { Target, Weight, Activity, DollarSign, ChevronRight } from 'lucide-react';

interface BuildGoalsProps {
  goals: BuildGoalsType;
  onUpdateGoals: (goals: BuildGoalsType) => void;
  onProceed: () => void;
}

const ACTIVITIES: { id: ActivityType; label: string; description: string }[] = [
  { id: 'TIME_ATTACK', label: 'TIME_ATTACK', description: 'MAXIMIZE_DOWNFORCE_AND_CORNERING_SPEED' },
  { id: 'DRAG_RACING', label: 'DRAG_RACING', description: 'MAXIMIZE_STRAIGHT_LINE_ACCELERATION' },
  { id: 'CIRCUIT_RACING', label: 'CIRCUIT_RACING', description: 'BALANCED_ENDURANCE_AND_CONSISTENCY' },
  { id: 'DRIFT', label: 'DRIFT_MODE', description: 'OVERSTEER_CONTROL_AND_LATERAL_STABILITY' },
  { id: 'STREET', label: 'STREET_PERF', description: 'OPTIMIZED_FOR_DAILY_DRIVABILITY' },
];

export const BuildGoals: React.FC<BuildGoalsProps> = ({ goals, onUpdateGoals, onProceed }) => {
  const handleChange = (field: keyof BuildGoalsType, value: any) => {
    onUpdateGoals({ ...goals, [field]: value });
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto hide-scrollbar bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="font-headline text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-2">BUILD_GOALS</h1>
          <p className="font-mono text-[10px] text-primary tracking-[0.3em] font-bold uppercase">DEFINE_MISSION_PARAMETERS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Target HP */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-6 group hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary">
                <Target className="w-5 h-5" />
              </div>
              <label className="font-headline text-sm font-bold uppercase tracking-widest">TARGET_HORSEPOWER</label>
            </div>
            <div className="flex items-end gap-4">
              <input 
                type="number" 
                value={goals.targetHp}
                onChange={(e) => handleChange('targetHp', parseInt(e.target.value) || 0)}
                className="bg-transparent border-b-2 border-outline-variant focus:border-primary text-4xl font-headline font-black italic w-full outline-none py-2 tabular-nums"
              />
              <span className="font-headline text-xl font-bold text-outline italic">BHP</span>
            </div>
          </div>

          {/* Target Weight */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-6 group hover:border-secondary/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/10 text-secondary">
                <Weight className="w-5 h-5" />
              </div>
              <label className="font-headline text-sm font-bold uppercase tracking-widest">TARGET_WEIGHT</label>
            </div>
            <div className="flex items-end gap-4">
              <input 
                type="number" 
                value={goals.targetWeight}
                onChange={(e) => handleChange('targetWeight', parseInt(e.target.value) || 0)}
                className="bg-transparent border-b-2 border-outline-variant focus:border-secondary text-4xl font-headline font-black italic w-full outline-none py-2 tabular-nums"
              />
              <span className="font-headline text-xl font-bold text-outline italic">KG</span>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-surface-container-low border border-outline-variant/20 p-6 group hover:border-white/50 transition-all md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 text-white">
                <DollarSign className="w-5 h-5" />
              </div>
              <label className="font-headline text-sm font-bold uppercase tracking-widest">MAX_BUDGET</label>
            </div>
            <div className="flex items-end gap-4">
              <span className="font-headline text-4xl font-black text-outline italic">$</span>
              <input 
                type="number" 
                value={goals.budget}
                onChange={(e) => handleChange('budget', parseInt(e.target.value) || 0)}
                className="bg-transparent border-b-2 border-outline-variant focus:border-white text-4xl font-headline font-black italic w-full outline-none py-2 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Activity Selection */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-headline text-xl font-bold uppercase tracking-widest italic">SELECT_ACTIVITY_PROFILE</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleChange('activity', activity.id)}
                className={`flex flex-col md:flex-row md:items-center justify-between p-6 border transition-all text-left
                  ${goals.activity === activity.id 
                    ? 'bg-primary-container border-primary shadow-[0_0_30px_rgba(224,30,34,0.2)]' 
                    : 'bg-surface-container-low border-outline-variant/20 hover:border-primary/50'}`}
              >
                <div className="mb-4 md:mb-0">
                  <div className={`font-headline text-xl font-black italic tracking-tighter uppercase mb-1 ${goals.activity === activity.id ? 'text-white' : 'text-outline-variant group-hover:text-white'}`}>
                    {activity.label}
                  </div>
                  <div className={`font-mono text-[9px] font-bold uppercase tracking-widest ${goals.activity === activity.id ? 'text-white/70' : 'text-outline'}`}>
                    {activity.description}
                  </div>
                </div>
                {goals.activity === activity.id && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest">
                    PROFILE_ACTIVE <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-outline-variant/20">
          <button 
            onClick={onProceed}
            className="bg-primary-container text-white px-12 py-5 font-headline font-black text-2xl italic tracking-widest uppercase hover:shadow-[0_0_40px_rgba(224,30,34,0.4)] transition-all active:scale-95 flex items-center gap-4"
          >
            INITIALIZE_BUILD <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
