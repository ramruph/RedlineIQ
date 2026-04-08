import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Share2, 
  MessageSquare, 
  Heart, 
  Camera, 
  Filter,
  ArrowRight,
  GripVertical,
  Wrench,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { Car } from '../types';

interface BuildTask {
  id: string;
  title: string;
  category: 'ENGINE' | 'AERO' | 'CHASSIS' | 'ELECTRONICS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  description: string;
  assignedTo?: string;
}

interface BuildLogEntry {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  type: 'UPDATE' | 'MILESTONE' | 'ISSUE';
}

interface BuildLogProps {
  activeCar: Car;
}

export const BuildLog: React.FC<BuildLogProps> = ({ activeCar }) => {
  const [tasks, setTasks] = useState<BuildTask[]>([
    { id: '1', title: 'INSTALL_HKS_TURBO_KIT', category: 'ENGINE', priority: 'HIGH', status: 'IN_PROGRESS', description: 'Mounting the GTIII-RS turbo and manifold.' },
    { id: '2', title: 'RE-ROUTE_INTERCOOLER_PIPING', category: 'ENGINE', priority: 'MEDIUM', status: 'TODO', description: 'Optimizing airflow path for better response.' },
    { id: '3', title: 'CHASSIS_STIFFENING_BRACES', category: 'CHASSIS', priority: 'HIGH', status: 'COMPLETED', description: 'Front and rear strut tower bars installed.' },
    { id: '4', title: 'ECU_MAPPING_FOR_E85', category: 'ELECTRONICS', priority: 'HIGH', status: 'TODO', description: 'Full dyno tune scheduled for next week.' },
    { id: '5', title: 'CARBON_REAR_DIFFUSER_MOUNT', category: 'AERO', priority: 'LOW', status: 'IN_PROGRESS', description: 'Custom brackets being fabricated.' },
  ]);

  const [logs, setLogs] = useState<BuildLogEntry[]>([
    { 
      id: 'l1', 
      timestamp: '2026-04-02T14:30:00Z', 
      author: 'SHAWN_R', 
      content: 'Finally got the HKS Turbo kit unboxed. The quality is insane. Starting the teardown now! #A80 #Supra #HKS',
      image: 'https://picsum.photos/seed/turbo/800/450',
      likes: 24,
      comments: 5,
      type: 'UPDATE'
    },
    { 
      id: 'l2', 
      timestamp: '2026-04-01T09:15:00Z', 
      author: 'SHAWN_R', 
      content: 'Chassis prep complete. Strut bars are in. Feeling much more rigid already.',
      likes: 12,
      comments: 2,
      type: 'MILESTONE'
    }
  ]);

  const columns: { id: BuildTask['status']; label: string; icon: any }[] = [
    { id: 'TODO', label: 'BACKLOG', icon: Circle },
    { id: 'IN_PROGRESS', label: 'ACTIVE_BUILD', icon: Clock },
    { id: 'COMPLETED', label: 'VERIFIED', icon: CheckCircle2 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-surface p-8 hide-scrollbar">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-outline-variant/10 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary">
                <Wrench className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-outline tracking-[0.3em] uppercase italic">BUILD_OPERATIONS // {activeCar.name}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-black italic tracking-tighter uppercase leading-none">
              PROJECT_<span className="text-primary">{activeCar.platform}</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-surface-container-high border border-outline-variant text-white font-headline font-black italic text-sm tracking-widest flex items-center gap-3 hover:bg-primary transition-all">
              SHARE_BUILD <Share2 className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 bg-primary text-white font-headline font-black italic text-sm tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(112,151,117,0.2)]">
              ADD_TASK <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-black italic tracking-tighter uppercase flex items-center gap-3">
              BUILD_PIPELINE <ArrowRight className="w-5 h-5 text-primary" />
            </h2>
            <div className="flex gap-2">
              <button className="p-2 bg-surface-container-low border border-outline-variant/20 text-outline hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.id} className="bg-surface-container-low/50 border border-outline-variant/10 flex flex-col min-h-[500px]">
                <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <col.icon className={`w-4 h-4 ${col.id === 'IN_PROGRESS' ? 'text-secondary' : col.id === 'COMPLETED' ? 'text-primary' : 'text-outline'}`} />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">{col.label}</span>
                    <span className="bg-surface-container-high text-outline px-2 py-0.5 text-[8px] font-bold rounded-full">
                      {tasks.filter(t => t.status === col.id).length}
                    </span>
                  </div>
                  <MoreVertical className="w-4 h-4 text-outline cursor-pointer" />
                </div>

                <div className="p-4 space-y-4 flex-1 overflow-y-auto hide-scrollbar">
                  {tasks.filter(t => t.status === col.id).map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      className="bg-surface border border-outline-variant/10 p-4 space-y-3 hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-[8px] font-bold px-2 py-0.5 border ${
                          task.category === 'ENGINE' ? 'text-primary border-primary/20 bg-primary/5' :
                          task.category === 'AERO' ? 'text-secondary border-secondary/20 bg-secondary/5' :
                          'text-white border-white/20 bg-white/5'
                        } uppercase tracking-widest`}>
                          {task.category}
                        </span>
                        <GripVertical className="w-3 h-3 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="text-sm font-headline font-bold uppercase italic leading-tight">{task.title}</h4>
                      <p className="text-[10px] text-outline font-headline uppercase leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2">
                          <div className="w-5 h-5 rounded-full bg-primary border border-surface flex items-center justify-center text-[8px] font-bold">SR</div>
                        </div>
                        <div className={`text-[8px] font-bold uppercase ${
                          task.priority === 'HIGH' ? 'text-primary' : 'text-outline'
                        }`}>
                          {task.priority}_PRIORITY
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Feed / Build Logs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          <div className="xl:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-headline font-black italic tracking-tighter uppercase">BUILD_JOURNAL</h2>
              <button className="flex items-center gap-2 text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">
                <Camera className="w-4 h-4" /> POST_UPDATE
              </button>
            </div>

            <div className="space-y-8">
              {logs.map((log) => (
                <div key={log.id} className="bg-surface-container-low border border-outline-variant/10 overflow-hidden">
                  {log.image && (
                    <div className="aspect-video overflow-hidden relative group">
                      <img src={log.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Update" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-headline font-black italic">SR</div>
                        <div>
                          <div className="text-sm font-headline font-black italic uppercase tracking-tighter">{log.author}</div>
                          <div className="text-[9px] font-mono text-outline uppercase">{new Date(log.timestamp).toLocaleString()}</div>
                        </div>
                      </div>
                      <span className={`text-[8px] font-bold px-2 py-1 border ${
                        log.type === 'MILESTONE' ? 'text-secondary border-secondary/30 bg-secondary/5' : 'text-primary border-primary/30 bg-primary/5'
                      } uppercase tracking-widest`}>
                        {log.type}
                      </span>
                    </div>

                    <p className="text-lg font-headline font-medium uppercase tracking-tight leading-relaxed">
                      {log.content}
                    </p>

                    <div className="flex items-center gap-8 pt-4 border-t border-outline-variant/10">
                      <button className="flex items-center gap-2 text-outline hover:text-primary transition-colors group">
                        <Heart className="w-5 h-5 group-hover:fill-current" />
                        <span className="text-xs font-mono font-bold">{log.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-outline hover:text-secondary transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs font-mono font-bold">{log.comments}</span>
                      </button>
                      <button className="ml-auto text-outline hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <div className="bg-surface-container-low p-8 border border-outline-variant/10 space-y-8">
              <h3 className="text-xl font-headline font-black italic tracking-tighter uppercase border-b border-outline-variant/10 pb-4">BUILD_METRICS</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-widest mb-2">
                    <span>COMPLETION_PROGRESS</span>
                    <span className="text-primary">64%</span>
                  </div>
                  <div className="h-1 bg-surface-container-high overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '64%' }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(112,151,117,0.5)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface border border-outline-variant/5">
                    <div className="text-[8px] text-outline font-bold uppercase mb-1">DAYS_ACTIVE</div>
                    <div className="text-2xl font-headline font-black italic tracking-tighter">142</div>
                  </div>
                  <div className="p-4 bg-surface border border-outline-variant/5">
                    <div className="text-[8px] text-outline font-bold uppercase mb-1">TOTAL_HOURS</div>
                    <div className="text-2xl font-headline font-black italic tracking-tighter">840</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8 border border-outline-variant/10 space-y-6">
              <h3 className="text-xl font-headline font-black italic tracking-tighter uppercase">COMMUNITY_RANK</h3>
              <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20">
                <Target className="w-10 h-10 text-primary" />
                <div>
                  <div className="text-[10px] font-bold text-primary uppercase tracking-widest">TIER_1_BUILDER</div>
                  <div className="text-lg font-headline font-black italic uppercase">TOP_5%_GLOBAL</div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-8 border border-outline-variant/10 space-y-6">
              <h3 className="text-xl font-headline font-black italic tracking-tighter uppercase">ACTIVE_FOLLOWERS</h3>
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold uppercase">
                    U{i}
                  </div>
                ))}
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-surface bg-primary flex items-center justify-center text-[10px] font-bold uppercase">
                  +42
                </div>
              </div>
              <button className="w-full py-3 border border-outline-variant/20 text-[10px] font-bold text-outline hover:text-white hover:border-white transition-all uppercase tracking-widest">
                MANAGE_COMMUNITY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
