import React, { useState } from 'react';
import { generatePresentation } from './services/geminiService';
import { Presentation, GeneratorStatus } from './types';
import { SlideCard } from './components/SlideCard';
import { MainView } from './components/MainView';

// Default prompt text based on user's request
const DEFAULT_TOPIC = "12月1日 第12周 围绕 2023 年以来“AI 概念股”狂热（如英伟达、科大讯飞、寒武纪），分析其股价飙升是信息有效反映还是市场非理性繁荣。制作 PPT, 汇报 45 分钟。";

const App: React.FC = () => {
    const [topic, setTopic] = useState(DEFAULT_TOPIC);
    const [status, setStatus] = useState<GeneratorStatus>(GeneratorStatus.IDLE);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        
        setStatus(GeneratorStatus.GENERATING);
        setErrorMsg(null);
        
        try {
            const result = await generatePresentation(topic);
            setPresentation(result);
            setStatus(GeneratorStatus.COMPLETE);
            setCurrentSlideIndex(0);
        } catch (e: any) {
            setStatus(GeneratorStatus.ERROR);
            setErrorMsg(e.message || "Failed to generate presentation. Please check your API key.");
        }
    };

    return (
        <div className="min-h-screen bg-fin-900 text-white flex flex-col font-sans overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 border-b border-fin-700 bg-fin-900 flex items-center justify-between px-6 z-20 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-fin-accent to-blue-700 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl tracking-tight">FinPre<span className="text-fin-accent">.AI</span></span>
                </div>
                
                {status === GeneratorStatus.COMPLETE && presentation && (
                    <div className="flex items-center gap-4">
                         <div className="px-3 py-1 bg-fin-800 rounded-md border border-fin-700 text-sm font-mono text-gray-400">
                            Est. Time: <span className="text-white font-bold">{presentation.totalDuration}</span>
                         </div>
                    </div>
                )}
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Inputs or Navigation */}
                <aside className="w-80 border-r border-fin-700 bg-fin-900 flex flex-col z-10">
                    <div className="p-4 border-b border-fin-700">
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Presentation Topic</label>
                        <textarea 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            disabled={status === GeneratorStatus.GENERATING}
                            className="w-full bg-fin-800 border border-fin-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-fin-accent focus:border-transparent outline-none resize-none h-32 transition-all placeholder-gray-500"
                            placeholder="Enter your financial topic here..."
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={status === GeneratorStatus.GENERATING || !topic.trim()}
                            className={`mt-3 w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                                ${status === GeneratorStatus.GENERATING 
                                    ? 'bg-fin-700 text-gray-400 cursor-not-allowed' 
                                    : 'bg-fin-accent hover:bg-blue-600 text-white shadow-lg shadow-blue-900/20'}`}
                        >
                            {status === GeneratorStatus.GENERATING ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing Market...
                                </>
                            ) : 'Generate 45m Deck'}
                        </button>
                    </div>

                    {status === GeneratorStatus.ERROR && (
                         <div className="p-4 bg-fin-danger/10 border-b border-fin-danger/20 text-fin-danger text-sm">
                            {errorMsg}
                        </div>
                    )}

                    {/* Slides List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {status === GeneratorStatus.COMPLETE && presentation ? (
                            presentation.slides.map((slide, idx) => (
                                <SlideCard 
                                    key={idx}
                                    index={idx}
                                    slide={slide}
                                    isActive={currentSlideIndex === idx}
                                    onClick={() => setCurrentSlideIndex(idx)}
                                />
                            ))
                        ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-6">
                                <div className="w-16 h-16 border-2 border-dashed border-gray-500 rounded-xl mb-4"></div>
                                <p className="text-sm font-mono">Slides will appear here</p>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1 bg-fin-900/50 p-8 overflow-hidden">
                    {status === GeneratorStatus.COMPLETE && presentation ? (
                        <MainView 
                            slide={presentation.slides[currentSlideIndex]} 
                            index={currentSlideIndex}
                            totalSlides={presentation.slides.length}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                            {status === GeneratorStatus.GENERATING ? (
                                <div className="text-center max-w-md">
                                    <div className="mb-8 relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-fin-800 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-fin-accent rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Structuring Presentation</h3>
                                    <p className="text-gray-400">Synthesizing efficient market data vs irrational exuberance indicators for {topic.substring(0, 30)}...</p>
                                </div>
                            ) : (
                                <div className="text-center max-w-xl p-8 rounded-2xl border border-fin-800 bg-fin-800/30">
                                    <h2 className="text-3xl font-bold text-white mb-4">Financial Presentation Generator</h2>
                                    <p className="text-gray-400 mb-6 leading-relaxed">
                                        Designed for high-stakes 45-minute presentations. 
                                        Input your topic, and our AI will generate a structured slide deck complete with 
                                        bullet points, visual suggestions, and a detailed speaker script.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 text-left">
                                        <div className="p-4 bg-fin-800 rounded border border-fin-700">
                                            <div className="text-fin-gold font-bold text-lg mb-1">45m</div>
                                            <div className="text-xs text-gray-500">Optimized Structure</div>
                                        </div>
                                        <div className="p-4 bg-fin-800 rounded border border-fin-700">
                                            <div className="text-fin-accent font-bold text-lg mb-1">Script</div>
                                            <div className="text-xs text-gray-500">Full Speaker Notes</div>
                                        </div>
                                        <div className="p-4 bg-fin-800 rounded border border-fin-700">
                                            <div className="text-fin-success font-bold text-lg mb-1">JSON</div>
                                            <div className="text-xs text-gray-500">Structured Data</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default App;