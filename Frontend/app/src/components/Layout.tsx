import React, { useState } from 'react';
import { 
  LucideIcon,
  Search, 
  Bell, 
  Settings, 
  Cpu, 
  Wind, 
  Settings2, 
  CircleDot, 
  BarChart3, 
  HelpCircle,
  Zap,
  LayoutDashboard,
  Timer,
  History,
  Activity,
  LayoutGrid,
  List,
  Menu,
  X,
  Target,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  User as UserIcon,
  Car as CarIcon,
  ClipboardList,
  DollarSign
} from 'lucide-react';
import { Screen, Car, User } from '../types';
import { Shield } from 'lucide-react';

interface SidebarProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeCar: Car;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeScreen, 
  onScreenChange, 
  isOpen, 
  onClose, 
  isCollapsed,
  onToggleCollapse,
  activeCar,
  user
}) => {
  
  const menuItems = [
  { id: 'CATALOGUE', label: 'CATALOGUE', icon: LayoutGrid },
  { id: 'BUILD_GOALS', label: 'BUILD_GOALS', icon: Target },
  { id: 'GARAGE', label: 'GARAGE_HOME', icon: LayoutDashboard },
  { id: 'DRIVETRAIN', label: 'DRIVETRAIN', icon: Settings2 },
  { id: 'PERFORMANCE', label: 'PERFORMANCE', icon: BarChart3 },
  { id: 'PRICING', label: 'PRICING', icon: DollarSign },
  { id: 'INTELLIGENCE', label: 'INTELLIGENCE', icon: BrainCircuit },
  { id: 'PROFILE', label: 'USER_PROFILE', icon: UserIcon },
];


  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed left-0 top-0 h-full z-[48] flex flex-col pt-20 bg-surface-container-low border-r border-outline-variant/10 transition-all duration-300 md:translate-x-0 
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        
        {/* Toggle Button (Desktop) */}
        <button 
          onClick={onToggleCollapse}
          className="hidden md:flex absolute -right-3 top-24 w-6 h-6 bg-primary text-white rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`py-8 border-b border-outline-variant/20 mb-4 transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-6'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="p-2 bg-surface-container-high shrink-0 flex items-center justify-center w-10 h-10">
              <CarIcon className="w-5 h-5 text-primary" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                <h3 className="text-primary font-headline font-bold text-sm tracking-widest uppercase">{activeCar.name}</h3>
                <p className="text-[10px] text-secondary font-bold tracking-tighter uppercase">ML_OPTIMIZATION_ACTIVE</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onScreenChange(item.id as Screen);
                onClose();
              }}
              title={isCollapsed ? item.label : ''}
              className={`w-full flex items-center transition-all duration-200 font-headline font-bold text-[11px] tracking-widest py-4
                ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-6'}
                ${activeScreen === item.id 
                  ? 'bg-primary-container/10 text-primary border-r-4 border-primary shadow-[inset_0_0_20px_rgba(224,30,34,0.05)]' 
                  : 'text-outline hover:bg-surface-container-high hover:text-white hover:translate-x-1'}`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-20' : 'w-4'}`}>
                <item.icon className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className={`py-6 space-y-4 transition-all duration-300 ${isCollapsed ? 'px-0' : 'px-6'}`}>
          <div className="space-y-3">
            <div className={`flex items-center text-[9px] text-outline font-bold tracking-widest uppercase transition-all
              ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-20' : 'w-1.5 h-1.5'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              </div>
              {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">CORE_SYNC: ACTIVE</span>}
            </div>
            <button 
              title={isCollapsed ? 'SYSTEM_STATUS' : ''}
              className={`flex items-center text-[10px] text-outline font-bold tracking-widest uppercase hover:text-white w-full text-left transition-all
                ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-20' : 'w-4'}`}>
                <BarChart3 className="w-4 h-4" /> 
              </div>
              {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">SYSTEM_STATUS</span>}
            </button>
            <button 
              title={isCollapsed ? 'HELP' : ''}
              className={`flex items-center text-[10px] text-outline font-bold tracking-widest uppercase hover:text-white w-full text-left transition-all
                ${isCollapsed ? 'justify-center' : 'gap-3'}`}
            >
              <div className={`flex items-center justify-center shrink-0 ${isCollapsed ? 'w-20' : 'w-4'}`}>
                <HelpCircle className="w-4 h-4" /> 
              </div>
              {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2 duration-300">HELP</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export const TopNav: React.FC<{ 
  activeScreen: Screen; 
  onScreenChange: (screen: Screen) => void; 
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
  user: User | null;
}> = ({ activeScreen, onScreenChange, onToggleSidebar, onToggleCollapse, user }) => {
  const navLinks = [
    { id: 'GARAGE', label: 'GARAGE' },
    { id: 'BUILD_GOALS', label: 'GOALS' },
    { id: 'INTELLIGENCE', label: 'INTELLIGENCE' },
    { id: 'CATALOGUE', label: 'CATALOGUE' },
    { id: 'DRIVETRAIN', label: 'DRIVETRAIN' },
    { id: 'PERFORMANCE', label: 'PERFORMANCE' },
    { id: 'PRICING', label: 'PRICING' },
  ];
  
  // const navLinks = [
  //   { id: 'GARAGE', label: 'GARAGE' },
  //   { id: 'BUILD_LOG', label: 'LOG' },
  //   { id: 'INTELLIGENCE', label: 'AI_LAB' },
  //   { id: 'MARKETPLACE', label: 'MARKET' },
  //   { id: 'CATALOGUE', label: 'CATALOGUE' },
  //   { id: 'WATCHLIST', label: 'WATCHLIST' },
  //   { id: 'INTEL_FEED', label: 'INTEL_FEED' },
  //   { id: 'PARTS_PRICING', label: 'PRICING' },
  //   { id: 'TELEMETRY', label: 'TELEMETRY' },
  //   { id: 'STAGING', label: 'STAGING' },
  // ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-6 py-4 bg-surface/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,180,171,0.05)] border-b border-outline-variant/10">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-surface-container-high transition-colors md:hidden"
        >
          <Menu className="w-6 h-6 text-primary" />
        </button>
        <button 
          onClick={onToggleCollapse}
          className="hidden md:p-2 md:hover:bg-surface-container-high md:transition-colors md:block"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
        <span className="text-xl font-black text-primary italic font-headline uppercase tracking-widest truncate max-w-[150px] md:max-w-none select-none">RedLineIQ</span>
        <div className="hidden xl:flex gap-6 items-center">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onScreenChange(link.id as Screen)}
              className={`font-headline uppercase tracking-widest text-[11px] font-bold transition-colors
                ${activeScreen === link.id 
                  ? 'text-primary border-b-2 border-primary-container pb-1' 
                  : 'text-outline hover:text-white'}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex bg-surface-container-low px-3 py-1 items-center gap-2 border border-outline-variant/30">
          <Search className="w-4 h-4 text-outline" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-xs font-headline tracking-widest p-0 w-24 md:w-32 uppercase text-white placeholder:text-outline/50" 
            placeholder="SEARCH..." 
            type="text"
          />
        </div>
        <button className="p-2 hover:bg-surface-container-high transition-colors">
          <Bell className="w-5 h-5 text-primary animate-blink" />
        </button>
        <button className="hidden sm:block p-2 hover:bg-surface-container-high transition-colors">
          <Settings className="w-5 h-5 text-primary" />
        </button>
        <button 
          onClick={() => onScreenChange('PROFILE')}
          className="w-8 h-8 md:w-10 md:h-10 bg-surface-container-high border border-outline-variant/30 overflow-hidden hover:border-primary transition-all"
        >
          <img 
            className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all" 
            src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuAetKdSrRWxDnfknn6xskoIpII1-H07gpif8Dv_ID41AExNtevejau8TbW-8jUpitj-K-c2InjvCr5uTN5zIIjPDoFkoBk1jjhB_L7Qa4pJjIxNKlxyWiplwkwCUxWI1cUu-afoPCw6s3WaxZz1NmO7rjw-uwJhqGZszNn6aw-KY18zodZrI_bwDhbbuFbWb647Zj9HEOpXx43O972ipVL0maXPvT4SUjHKDXnhnN-Gk-4hFwqnu5DxnLGzK7qFhQldCuACT_gyVm0"} 
            alt="Profile"
          />
        </button>
      </div>
    </nav>
  );
};
