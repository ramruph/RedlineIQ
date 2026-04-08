import React, { useState } from 'react';
import { Screen, Car } from './types';
import { Sidebar, TopNav } from './components/Layout';
import { Garage } from './components/Garage';
import { Telemetry } from './components/Telemetry';
import { Drivetrain } from './components/Drivetrain';
import { Performance } from './components/Performance';
import { Staging } from './components/Staging';
import { Pricing } from './components/Pricing';
import { Reliability } from './components/Reliability';
import { Workflow } from './components/Workflow';
import { Aero } from './components/Aero';
import { Chassis } from './components/Chassis';
import { Electronics } from './components/Electronics';
import { PartsPricing } from './components/PartsPricing';
import { Catalogue } from './components/Catalogue';
import { ChassisMarketplace } from './components/ChassisMarketplace';
import { WatchList } from './components/WatchList';
import { IntelFeed } from './components/IntelFeed';
import { ApexIntelligence } from './components/ApexIntelligence';
import { BuildLog } from './components/BuildLog';
import { LandingPage, LoginPage, UserProfile } from './components/Auth';
import { CARS } from './constants';
import { BuildGoals as BuildGoalsType, User } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('LANDING');
  const [user, setUser] = useState<User | null>(null);
  const [activeCar, setActiveCar] = useState<Car>(CARS.find(c => c.active) || CARS[0]);
  const [garageCars, setGarageCars] = useState<Car[]>(CARS.slice(0, 2)); // Starts with A80 and R34
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [buildGoals, setBuildGoals] = useState<BuildGoalsType>({
    targetHp: 800,
    targetWeight: 1200,
    activity: 'CIRCUIT_RACING',
    budget: 50000,
  });

  const isAuthScreen = activeScreen === 'LANDING' || activeScreen === 'LOGIN';

  const handleLogin = (userData: User) => {
    setUser(userData);
    setActiveScreen('GARAGE');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveScreen('LANDING');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface-dim text-on-surface font-sans selection:bg-primary selection:text-white">
      {!isAuthScreen && (
        <TopNav 
          activeScreen={activeScreen} 
          onScreenChange={setActiveScreen} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user}
        />
      )}
      <div className={`flex-1 flex overflow-hidden relative ${!isAuthScreen ? 'pt-16' : ''}`}>
        {!isAuthScreen && (
          <Sidebar 
            activeScreen={activeScreen} 
            onScreenChange={setActiveScreen} 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            activeCar={activeCar}
            user={user}
          />
        )}
        <main className={`flex-1 overflow-hidden relative transition-all duration-300 
          ${isAuthScreen ? 'ml-0' : (isSidebarOpen ? 'ml-0' : isSidebarCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64')}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,30,34,0.03),transparent_70%)] pointer-events-none" />
          
          {activeScreen === 'LANDING' && (
            <LandingPage onStart={() => setActiveScreen('GARAGE')} onLogin={() => setActiveScreen('LOGIN')} />
          )}
          {activeScreen === 'LOGIN' && (
            <LoginPage onLogin={handleLogin} onBack={() => setActiveScreen('LANDING')} />
          )}
          {activeScreen === 'PROFILE' && (
            user ? (
              <UserProfile 
                user={user} 
                onLogout={handleLogout} 
                onScreenChange={setActiveScreen} 
                garageCars={garageCars}
              />
            ) : (
              <LoginPage onLogin={handleLogin} onBack={() => setActiveScreen('LANDING')} />
            )
          )}
          {activeScreen === 'GARAGE' && (
            <Garage 
              activeCar={activeCar} 
              goals={buildGoals} 
              onUpdateGoals={setBuildGoals} 
              onScreenChange={setActiveScreen}
            />
          )}
          {activeScreen === 'INTELLIGENCE' && (
            <ApexIntelligence car={activeCar} goals={buildGoals} />
          )}
          {activeScreen === 'BUILD_LOG' && (
            <BuildLog activeCar={activeCar} />
          )}
          {activeScreen === 'AERO' && <Aero goals={buildGoals} />}
          {activeScreen === 'DRIVETRAIN' && <Drivetrain goals={buildGoals} car={activeCar} />}
          {activeScreen === 'CHASSIS' && <Chassis goals={buildGoals} />}
          {activeScreen === 'ELECTRONICS' && <Electronics goals={buildGoals} />}
          {activeScreen === 'PARTS_PRICING' && <PartsPricing />}
          {activeScreen === 'CATALOGUE' && (
            <Catalogue 
              activeCar={activeCar} 
              onSelectCar={setActiveCar} 
              garageCars={garageCars}
              onAddToGarage={(car) => setGarageCars(prev => prev.some(c => c.id === car.id) ? prev : [...prev, car])}
            />
          )}
          {activeScreen === 'MARKETPLACE' && (
            <ChassisMarketplace 
              goals={buildGoals}
              garageCars={garageCars}
              onAddToGarage={(car) => setGarageCars(prev => prev.some(c => c.id === car.id) ? prev : [...prev, car])}
            />
          )}
          {activeScreen === 'WATCHLIST' && <WatchList />}
          {activeScreen === 'INTEL_FEED' && <IntelFeed />}
          {activeScreen === 'TELEMETRY' && <Telemetry activeCar={activeCar} garageCars={garageCars} />}
          {activeScreen === 'PERFORMANCE' && <Performance />}
          {activeScreen === 'STAGING' && <Staging />}
          {activeScreen === 'PRICING' && <Pricing />}
          {activeScreen === 'RELIABILITY' && <Reliability />}
          {activeScreen === 'WORKFLOW' && <Workflow />}
          
          {/* Footer - Hidden on mobile for space */}
          <footer className="hidden md:flex absolute bottom-0 left-0 right-0 h-10 z-40 items-center justify-between px-6 bg-surface-container-low/80 backdrop-blur-md border-t border-outline-variant/10 cursor-crosshair">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-secondary tabular-nums uppercase tracking-widest">
                CORE_LATENCY: 14MS // BUFFER: 0% // STATUS: OPTIMIZED // SYSTEM_UPTIME: 00:42:12
              </span>
            </div>
            <div className="flex gap-8">
              <a className="font-mono text-[9px] text-outline-variant hover:text-white transition-colors uppercase tracking-widest" href="#">GITHUB_REPO</a>
              <a className="font-mono text-[9px] text-outline-variant hover:text-white transition-colors uppercase tracking-widest" href="#">API_DOCS</a>
              <a className="font-mono text-[9px] text-secondary underline uppercase tracking-widest" href="#">V0.8.4_ALPHA</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
