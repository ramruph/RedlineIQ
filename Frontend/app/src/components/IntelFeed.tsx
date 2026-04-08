import React, { useState, useEffect } from 'react';
import { getAutomotiveNews } from '../services/geminiService';
import { Newspaper, BookOpen, Zap, ExternalLink, RefreshCw, Search, Filter, TrendingUp, Clock, ChevronRight } from 'lucide-react';

interface Article {
  title: string;
  summary: string;
  source: string;
  category: string;
  date: string;
}

export const IntelFeed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'LATEST' | 'TECH' | 'RACING'>('LATEST');

  const fetchNews = async (topic?: string) => {
    setLoading(true);
    try {
      const news = await getAutomotiveNews(topic);
      if (news && Array.isArray(news)) {
        setArticles(news);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleTabChange = (tab: 'LATEST' | 'TECH' | 'RACING') => {
    setActiveTab(tab);
    const topics = {
      LATEST: "latest automotive racing news and engineering breakthroughs",
      TECH: "advanced automotive engineering and aerodynamics techniques",
      RACING: "professional circuit racing techniques and telemetry analysis"
    };
    fetchNews(topics[tab]);
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto hide-scrollbar bg-surface flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 text-primary border border-primary/20">
                <Newspaper className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] text-primary tracking-[0.4em] font-black uppercase">INTEL_FEED // GLOBAL_UPLINK_v2.0</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-2">TECHNICAL_INTEL</h1>
            <p className="font-mono text-[11px] text-outline uppercase tracking-widest">REAL-TIME_AUTOMOTIVE_ENGINEERING_AND_RACING_INTELLIGENCE</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => fetchNews()}
              disabled={loading}
              className="bg-surface-container-high border border-outline-variant/30 px-6 py-3 flex items-center gap-3 hover:bg-surface-container-highest transition-all group"
            >
              <RefreshCw className={`w-4 h-4 text-primary ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="font-headline text-sm font-bold uppercase tracking-widest italic">REFRESH_FEED</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/20 mb-8 overflow-x-auto hide-scrollbar">
          {[
            { id: 'LATEST', label: 'LATEST_UPDATES', icon: Clock },
            { id: 'TECH', label: 'ENGINEERING_TECH', icon: Zap },
            { id: 'RACING', label: 'RACING_TECHNIQUE', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 font-headline text-xs font-bold uppercase tracking-widest italic transition-all relative
                ${activeTab === tab.id ? 'text-primary' : 'text-outline hover:text-white'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(224,30,34,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Left Column: Featured & List */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-surface-container-low border border-outline-variant/10 p-8 animate-pulse">
                    <div className="h-4 bg-surface-container-highest w-1/4 mb-4"></div>
                    <div className="h-8 bg-surface-container-highest w-3/4 mb-6"></div>
                    <div className="h-4 bg-surface-container-highest w-full mb-2"></div>
                    <div className="h-4 bg-surface-container-highest w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article, idx) => (
                  <div 
                    key={idx} 
                    className="bg-surface-container-low border border-outline-variant/20 p-8 group hover:border-primary/50 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <BookOpen className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 text-[9px] font-black uppercase tracking-widest border border-primary/20">
                        {article.category}
                      </span>
                      <span className="font-mono text-[10px] text-outline uppercase tracking-widest">
                        {article.date} // SOURCE: {article.source}
                      </span>
                    </div>
                    <h3 className="font-headline text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-4 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-mono text-xs text-outline leading-relaxed uppercase mb-8 max-w-2xl">
                      {article.summary}
                    </p>
                    <button className="flex items-center gap-3 text-[10px] font-bold text-primary uppercase tracking-[0.3em] hover:translate-x-2 transition-transform">
                      ACCESS_FULL_REPORT <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-outline-variant/30">
                <AlertCircle className="w-12 h-12 text-outline mb-4" />
                <h4 className="font-headline text-xl font-bold uppercase italic tracking-widest text-outline">FEED_OFFLINE</h4>
                <p className="font-mono text-[10px] text-outline/60 uppercase tracking-widest mt-2">UPLINK_TIMEOUT: UNABLE_TO_RETRIEVE_GLOBAL_INTEL</p>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Intel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-low border border-outline-variant/20 p-6">
              <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-6 flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-primary" /> TRENDING_TOPICS
              </h3>
              <div className="space-y-3">
                {[
                  { tag: 'ACTIVE_AERO', count: '1.2K' },
                  { tag: 'SOLID_STATE_BATTERIES', count: '842' },
                  { tag: 'CFD_OPTIMIZATION', count: '2.1K' },
                  { tag: 'TIRE_DEGRADATION_MODELS', count: '560' },
                  { tag: 'HYBRID_KINETIC_RECOVERY', count: '1.5K' }
                ].map((topic) => (
                  <div key={topic.tag} className="flex justify-between items-center p-3 bg-surface-container-high border border-outline-variant/10 hover:bg-surface-container-highest transition-colors cursor-pointer group">
                    <span className="font-mono text-[10px] text-outline group-hover:text-white transition-colors">#{topic.tag}</span>
                    <span className="font-mono text-[9px] text-primary font-bold">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant/20 p-6">
              <h3 className="font-headline text-xs font-bold uppercase tracking-widest text-outline mb-6">INTEL_SOURCES</h3>
              <div className="space-y-4">
                {[
                  'FIA_TECHNICAL_REPORTS',
                  'F1_ENGINEERING_JOURNAL',
                  'SAE_INTERNATIONAL',
                  'RACE_TECH_MAGAZINE',
                  'MOTORSPORT_TECHNOLOGY'
                ].map((source) => (
                  <div key={source} className="flex items-center gap-3 text-[10px] font-bold text-outline uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">
                    <ExternalLink className="w-3 h-3" /> {source}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-headline text-sm font-bold uppercase italic tracking-widest">AI_SUGGESTION</span>
              </div>
              <p className="font-mono text-[10px] text-outline uppercase leading-relaxed">
                Based on your current <span className="text-primary font-bold">A80_SUPRA</span> build, we recommend following the "CFD_OPTIMIZATION" topic for the latest in underbody ground-effect research.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
