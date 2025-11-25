import React from 'react';
import { Slide } from '../types';

interface MainViewProps {
    slide: Slide;
    index: number;
    totalSlides: number;
}

export const MainView: React.FC<MainViewProps> = ({ slide, index, totalSlides }) => {
    return (
        <div className="h-full flex flex-col gap-6">
            {/* Slide Preview Area (16:9 Aspect Ratio) */}
            <div className="w-full aspect-video bg-white rounded-lg shadow-2xl p-8 flex flex-col relative overflow-hidden text-slate-900">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100 rounded-tr-full opacity-50"></div>
                
                {/* Header */}
                <div className="flex justify-between items-end border-b-2 border-slate-800 pb-4 mb-6 z-10">
                    <h1 className="text-3xl font-bold text-slate-900 leading-tight w-3/4">
                        {slide.title}
                    </h1>
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-400 tracking-widest uppercase">FinPre AI</span>
                        <span className="block text-lg font-mono text-slate-500">{index + 1} / {totalSlides}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-4 z-10">
                    <ul className="space-y-4">
                        {slide.bulletPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-3 text-lg font-medium text-slate-700">
                                <span className="mt-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer / Chart Placeholder */}
                <div className="mt-auto pt-6 border-t border-slate-200 z-10">
                    <div className="bg-slate-50 border border-dashed border-slate-300 rounded p-4 flex items-center justify-center gap-3 text-slate-500">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        <span className="text-sm font-mono italic">{slide.visualSuggestion}</span>
                    </div>
                </div>
            </div>

            {/* Speaker Notes Area */}
            <div className="flex-1 bg-fin-800 rounded-xl p-6 border border-fin-700 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-fin-gold rounded-full"></div>
                    <h2 className="text-lg font-semibold text-white">Speaker Notes (Script)</h2>
                    <span className="ml-auto text-xs bg-fin-700 text-fin-gold px-2 py-1 rounded-full font-mono">
                        ~{slide.estimatedDuration} read time
                    </span>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {slide.speakerNotes}
                </div>
            </div>
        </div>
    );
};