import React from 'react';
import { motion } from 'motion/react';
import { Car as CarIcon, Zap, Shield, Target, ChevronRight, LogIn, User as UserIcon, LogOut, Settings, List, LayoutDashboard } from 'lucide-react';
import { Screen, User, Car } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,151,117,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex items-center justify-center">
          <span className="text-[30rem] font-black font-headline tracking-tighter select-none">VELOCITY</span>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="w-12 h-1 bg-primary" />
            <span className="text-primary font-mono text-sm font-bold tracking-[0.4em] uppercase italic">REDLINE_IQ // SYSTEM_BOOT</span>
            <div className="w-12 h-1 bg-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-7xl md:text-9xl font-headline font-black italic tracking-tighter uppercase mb-8 leading-none"
          >
            APEX_<span className="text-primary">VELOCITY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-outline text-lg md:text-xl max-w-2xl font-headline uppercase tracking-widest mb-12 leading-relaxed"
          >
            The next generation of automotive performance engineering. 
            <span className="text-white"> Data-driven builds.</span> 
            <span className="text-secondary"> ML-optimized tuning.</span> 
            <span className="text-primary"> Track-proven results.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <button
              onClick={onStart}
              className="px-12 py-5 bg-primary text-white font-headline font-black text-2xl italic tracking-widest flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(112,151,117,0.3)] group"
            >
              INITIALIZE_BUILD <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onLogin}
              className="px-12 py-5 bg-surface-container-high border border-outline-variant text-white font-headline font-black text-2xl italic tracking-widest flex items-center gap-4 hover:bg-surface-container-highest transition-all"
            >
              ACCESS_ACCOUNT <LogIn className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-12 hidden lg:block">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold tracking-widest uppercase">ACTIVE_USERS</span>
              <span className="text-2xl font-headline font-bold text-primary tabular-nums italic">14,282</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold tracking-widest uppercase">SIMULATIONS_RUN</span>
              <span className="text-2xl font-headline font-bold text-secondary tabular-nums italic">1.2M+</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:block text-right">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold tracking-widest uppercase">SYSTEM_LATENCY</span>
              <span className="text-2xl font-headline font-bold text-white tabular-nums italic">0.02MS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-outline font-bold tracking-widest uppercase">KERNEL_VERSION</span>
              <span className="text-2xl font-headline font-bold text-outline tabular-nums italic">v4.2.1-STABLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-surface-container-low border-y border-outline-variant/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Zap, 
                title: 'ML_OPTIMIZATION', 
                desc: 'Our neural networks analyze thousands of part combinations to find the perfect balance of power and reliability.',
                color: 'text-primary'
              },
              { 
                icon: Shield, 
                title: 'RELIABILITY_MODELING', 
                desc: 'Predict component failure points before they happen. Build with confidence knowing your engine can handle the load.',
                color: 'text-secondary'
              },
              { 
                icon: Target, 
                title: 'MISSION_DRIVEN', 
                desc: 'Set your target HP, weight, and activity. We provide the roadmap to achieve your specific automotive goals.',
                color: 'text-white'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 bg-surface border border-outline-variant/10 hover:border-primary/30 transition-colors group"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl font-headline font-black italic mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-outline font-headline text-sm uppercase tracking-widest leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const handleMockLogin = () => {
    const mockUser: User = {
      uid: 'mock-user-123',
      displayName: 'SHAWN RAMRUP',
      email: 'RamrupShawn@gmail.com',
      photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAetKdSrRWxDnfknn6xskoIpII1-H07gpif8Dv_ID41AExNtevejau8TbW-8jUpitj-K-c2InjvCr5uTN5zIIjPDoFkoBk1jjhB_L7Qa4pJjIxNKlxyWiplwkwCUxWI1cUu-afoPCw6s3WaxZz1NmO7rjw-uwJhqGZszNn6aw-KY18zodZrI_bwDhbbuFbWb647Zj9HEOpXx43O972ipVL0maXPvT4SUjHKDXnhnN-Gk-4hFwqnu5DxnLGzK7qFhQldCuACT_gyVm0',
      garageCount: 2,
      totalBuildValue: 125400,
      joinedAt: new Date().toISOString(),
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(112,151,117,0.05),transparent_70%)]" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-low border border-outline-variant/20 p-10 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="p-4 bg-primary/10 text-primary mb-6">
            <LogIn className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-headline font-black italic tracking-tighter uppercase mb-2">SYSTEM_ACCESS</h2>
          <p className="text-outline text-xs font-bold uppercase tracking-widest">AUTHENTICATION_REQUIRED_FOR_CLOUD_SYNC</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleMockLogin}
            className="w-full py-4 bg-white text-black font-headline font-black text-lg italic tracking-widest flex items-center justify-center gap-4 hover:bg-primary hover:text-white transition-all group"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:invert" alt="Google" />
            LOGIN_WITH_GOOGLE
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/20"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-outline"><span className="bg-surface-container-low px-2">SECURE_GATEWAY</span></div>
          </div>

          <button
            disabled
            className="w-full py-4 bg-surface-container-high border border-outline-variant/30 text-outline font-headline font-black text-lg italic tracking-widest flex items-center justify-center gap-4 opacity-50 cursor-not-allowed"
          >
            GITHUB_OAUTH_PENDING
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full mt-8 text-[10px] font-bold text-outline hover:text-primary transition-colors uppercase tracking-widest"
        >
          RETURN_TO_TERMINAL
        </button>
      </motion.div>
    </div>
  );
};

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onScreenChange: (screen: Screen) => void;
  garageCars: Car[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onScreenChange, garageCars }) => {
  return (
    <div className="h-full overflow-y-auto bg-surface p-8 hide-scrollbar">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-low p-10 border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <UserIcon className="w-64 h-64" />
          </div>
          
          <div className="w-32 h-32 md:w-48 md:h-48 bg-surface-container-high border-2 border-primary overflow-hidden shrink-0 relative group">
            <img src={user.photoURL} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" alt={user.displayName} />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Settings className="w-8 h-8 text-white animate-spin-slow" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 font-mono text-[8px] font-bold border border-primary/20 uppercase tracking-widest">VERIFIED_ENGINEER</span>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest">UID: {user.uid}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-black italic tracking-tighter uppercase mb-4 leading-none">{user.displayName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-bold tracking-widest uppercase">EMAIL_ADDRESS</span>
                <span className="text-sm font-headline font-bold text-white">{user.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-bold tracking-widest uppercase">MEMBER_SINCE</span>
                <span className="text-sm font-headline font-bold text-white italic">{new Date(user.joinedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-bold tracking-widest uppercase">ACCOUNT_STATUS</span>
                <span className="text-sm font-headline font-bold text-primary italic">ACTIVE_PREMIUM</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={onLogout}
              className="px-6 py-3 bg-surface-container-high border border-outline-variant text-outline hover:text-primary hover:border-primary transition-all font-headline font-black italic text-sm tracking-widest flex items-center justify-center gap-3"
            >
              TERMINATE_SESSION <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'GARAGE_CAPACITY', value: user.garageCount, unit: 'UNITS', icon: LayoutDashboard, color: 'text-primary' },
            { label: 'TOTAL_BUILD_VALUE', value: `$${user.totalBuildValue.toLocaleString()}`, unit: 'USD', icon: Zap, color: 'text-secondary' },
            { label: 'WATCHLIST_ITEMS', value: 12, unit: 'PARTS', icon: List, color: 'text-white' }
          ].map((stat, i) => (
            <div key={i} className="bg-surface-container-low p-8 border border-outline-variant/10 group hover:bg-surface-container-high transition-colors">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-6`} />
              <div className="text-[10px] text-outline font-bold tracking-widest uppercase mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-headline font-black italic tracking-tighter">{stat.value}</span>
                <span className="text-[10px] font-bold text-outline uppercase">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Owned Cars Section */}
        <div className="bg-surface-container-low p-10 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline font-black italic tracking-tighter uppercase">OWNED_VEHICLES</h2>
            <button 
              onClick={() => onScreenChange('CATALOGUE')}
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
            >
              EXPAND_GARAGE
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {garageCars.map((car) => (
              <div 
                key={car.id}
                onClick={() => onScreenChange('GARAGE')}
                className="bg-surface border border-outline-variant/10 p-6 flex gap-6 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 bg-surface-container-high shrink-0 overflow-hidden">
                  <img src={car.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={car.name} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">{car.platform}</div>
                  <h3 className="text-xl font-headline font-black italic uppercase mb-2">{car.name}</h3>
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-outline font-bold uppercase">POWER</span>
                      <span className="text-xs font-mono font-bold text-primary">{car.specs.hp} HP</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] text-outline font-bold uppercase">WEIGHT</span>
                      <span className="text-xs font-mono font-bold text-secondary">{car.specs.weight} KG</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low p-10 border border-outline-variant/10">
            <h2 className="text-2xl font-headline font-black italic tracking-tighter uppercase mb-8">ACCOUNT_DETAILS</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">SUBSCRIPTION_TIER</span>
                <span className="text-sm font-headline font-bold text-primary italic uppercase">PRO_ENGINEER</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">DATA_STORAGE</span>
                <span className="text-sm font-headline font-bold text-white uppercase">1.2GB / 5.0GB</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">API_ACCESS</span>
                <span className="text-sm font-headline font-bold text-secondary uppercase">ENABLED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">LAST_LOGIN_IP</span>
                <span className="text-sm font-mono text-outline">192.168.1.104</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-10 border border-outline-variant/10">
            <h2 className="text-2xl font-headline font-black italic tracking-tighter uppercase mb-8">SYSTEM_PREFERENCES</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">UI_THEME</span>
                <span className="text-sm font-headline font-bold text-white uppercase">SAGE_CARBON</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">UNITS_SYSTEM</span>
                <span className="text-sm font-headline font-bold text-white uppercase">METRIC</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">NOTIFICATIONS</span>
                <span className="text-sm font-headline font-bold text-primary uppercase">ENABLED</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">AUTO_SAVE</span>
                <span className="text-sm font-headline font-bold text-primary uppercase">ON</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container-low p-10 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-headline font-black italic tracking-tighter uppercase">RECENT_OPERATIONS</h2>
            <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">VIEW_FULL_LOGS</button>
          </div>
          <div className="space-y-4">
            {[
              { action: 'MOD_INSTALLED', target: 'HKS_GTIII-RS TURBO_KIT', time: '2H AGO', status: 'SUCCESS' },
              { action: 'SIM_COMPLETED', target: 'CIRCUIT_RACING_A80', time: '5H AGO', status: 'SUCCESS' },
              { action: 'WATCHLIST_ADD', target: 'MOTEC_M150 ECU', time: '1D AGO', status: 'INFO' },
              { action: 'CONFIG_SAVED', target: 'STAGE_3_DRAG_R34', time: '2D AGO', status: 'SUCCESS' }
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-surface border border-outline-variant/5 hover:border-outline-variant/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-8 ${log.status === 'SUCCESS' ? 'bg-primary' : 'bg-secondary'}`} />
                  <div>
                    <div className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">{log.action}</div>
                    <div className="text-sm font-headline font-bold uppercase italic">{log.target}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-outline">{log.time}</div>
                  <div className={`text-[8px] font-bold uppercase ${log.status === 'SUCCESS' ? 'text-primary' : 'text-secondary'}`}>{log.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
