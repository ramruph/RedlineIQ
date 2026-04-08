import React, { useState, useEffect } from 'react';
import { getTuningSuggestions } from '../services/geminiService';
import { Sparkles, RefreshCw, Terminal } from 'lucide-react';
import { Car } from '../types';

interface GeminiTuningProps {
  car: Car;
}

export const GeminiTuning: React.FC<GeminiTuningProps> = ({ car }) => {
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await getTuningSuggestions(car.name, car.specs, car.performance);
      setSuggestions(res);
    } catch (err) {
      setSuggestions("ERROR: Failed to reach Apex Intelligence Core.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [car.id]);

  return (
    <div className="bg-surface-container-high/40 backdrop-blur-md border border-primary/20 p-4 relative group overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="font-label text-[10px] text-primary font-black uppercase tracking-[0.2em]">APEX_INTELLIGENCE // TUNING_CORE</span>
        </div>
        <button 
          onClick={fetchSuggestions}
          disabled={loading}
          className={`p-1 hover:bg-surface-container-highest transition-colors ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw className="w-3 h-3 text-outline" />
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 bg-surface-container-highest w-full animate-pulse"></div>
            <div className="h-3 bg-surface-container-highest w-[80%] animate-pulse"></div>
            <div className="h-3 bg-surface-container-highest w-[90%] animate-pulse"></div>
          </div>
        ) : (
          <div className="font-mono text-[10px] leading-relaxed text-on-surface/80 whitespace-pre-line">
            {suggestions || "Initializing intelligence core..."}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-outline" />
          <span className="text-[8px] text-outline uppercase font-bold">MODEL: GEMINI_3_FLASH</span>
        </div>
        <span className="text-[8px] text-secondary font-black uppercase tracking-widest">READY_FOR_DEPLOYMENT</span>
      </div>
    </div>
  );
};
