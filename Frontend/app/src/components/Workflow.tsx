import React from 'react';
import { LayoutGrid, CheckCircle2, Clock, Users, MessageSquare, Plus, Activity } from 'lucide-react';

const tasks = [
  { id: 1, title: 'ENGINE_MAP_V4_CALIBRATION', status: 'IN_PROGRESS', priority: 'CRITICAL', assignee: 'SHAWN_R' },
  { id: 2, title: 'AERO_TUNNEL_SIMULATION_03', status: 'COMPLETE', priority: 'HIGH', assignee: 'EMILY_W' },
  { id: 3, title: 'TIRE_COMPOUND_ANALYSIS', status: 'PENDING', priority: 'MEDIUM', assignee: 'ALEX_M' },
  { id: 4, title: 'CHASSIS_STIFFNESS_TESTING', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'SHAWN_R' },
  { id: 5, title: 'FUEL_SYSTEM_REDUNDANCY_CHECK', status: 'COMPLETE', priority: 'LOW', assignee: 'SARAH_L' },
  { id: 6, title: 'BRAKE_COOLING_DUCT_RE-DESIGN', status: 'PENDING', priority: 'HIGH', assignee: 'EMILY_W' },
];

export const Workflow: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto hide-scrollbar bg-surface-dim">
      <div className="grid grid-cols-12 gap-8">
        {/* Header */}
        <div className="col-span-12 flex justify-between items-end border-b border-outline-variant/20 pb-4">
          <div>
            <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.3em]">TEAM_WORKFLOW // MANAGEMENT</span>
            <h1 className="font-headline text-4xl font-black tracking-tighter italic uppercase">PROJECT_VELOCITY // BOARD</h1>
          </div>
          <button className="bg-primary-container text-white px-6 py-2 font-headline font-black text-sm italic flex items-center gap-2 hover:shadow-[0_0_20px_rgba(224,30,34,0.3)] transition-all">
            <Plus className="w-4 h-4" />
            <span>NEW_TASK</span>
          </button>
        </div>

        {/* Task Board */}
        <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column: PENDING */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-outline" />
              <span className="font-label text-[11px] font-black uppercase tracking-widest text-outline">PENDING_TASKS</span>
            </div>
            {tasks.filter(t => t.status === 'PENDING').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Column: IN_PROGRESS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-secondary" />
              <span className="font-label text-[11px] font-black uppercase tracking-widest text-secondary">IN_PROGRESS</span>
            </div>
            {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Column: COMPLETE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-on-surface" />
              <span className="font-label text-[11px] font-black uppercase tracking-widest text-on-surface">COMPLETE</span>
            </div>
            {tasks.filter(t => t.status === 'COMPLETE').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Team Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-surface-container-high p-6 border border-outline-variant/10">
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-6">TEAM_ACTIVE</h3>
            <div className="space-y-4">
              {['SHAWN_R', 'EMILY_W', 'ALEX_M', 'SARAH_L'].map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center relative">
                    <span className="text-[10px] font-bold">{member[0]}</span>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface"></div>
                  </div>
                  <span className="font-mono text-[11px] font-bold">{member}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-6 border border-outline-variant/10">
            <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-4">SYSTEM_COMMS</h3>
            <div className="space-y-4">
              <div className="p-3 bg-surface-container-high/50 border-l-2 border-primary">
                <p className="text-[10px] font-bold uppercase mb-1">SHAWN_R</p>
                <p className="text-[11px] text-outline leading-tight">Map V4 is stable. Ready for dyno testing at 14:00.</p>
              </div>
              <div className="p-3 bg-surface-container-high/50 border-l-2 border-secondary">
                <p className="text-[10px] font-bold uppercase mb-1">EMILY_W</p>
                <p className="text-[11px] text-outline leading-tight">Aero tunnel 03 results are in. 0.28 CD achieved.</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                placeholder="SEND_MESSAGE..." 
                className="flex-1 bg-surface-container-highest border border-outline-variant/30 px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-primary transition-colors"
              />
              <button className="p-2 bg-primary-container text-white">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard: React.FC<{ task: any }> = ({ task }) => (
  <div className="bg-surface-container-low p-4 border border-outline-variant/10 hover:border-primary/30 transition-all group cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <span className={`text-[8px] font-black tracking-widest px-2 py-0.5 ${
        task.priority === 'CRITICAL' ? 'bg-primary text-white' : 
        task.priority === 'HIGH' ? 'bg-primary/20 text-primary' : 'bg-on-surface/20 text-on-surface'
      }`}>
        {task.priority}
      </span>
      <span className="text-[9px] font-mono text-outline">{task.assignee}</span>
    </div>
    <h4 className="font-headline text-sm font-bold tracking-tight mb-4 group-hover:text-primary transition-colors">{task.title}</h4>
    <div className="flex justify-between items-center">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-surface flex items-center justify-center text-[8px] font-bold">SR</div>
        <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-surface flex items-center justify-center text-[8px] font-bold">+2</div>
      </div>
      <div className="flex items-center gap-1 text-outline">
        <MessageSquare className="w-3 h-3" />
        <span className="text-[9px] font-bold">4</span>
      </div>
    </div>
  </div>
);
