import React from 'react';
import { Slide } from '../types';

interface SlideCardProps {
    slide: Slide;
    index: number;
    isActive: boolean;
    onClick: () => void;
}

export const SlideCard: React.FC<SlideCardProps> = ({ slide, index, isActive, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-200 ${
                isActive 
                ? 'bg-fin-800 border-fin-accent ring-1 ring-fin-accent' 
                : 'bg-fin-800/50 border-fin-700 hover:border-fin-500 hover:bg-fin-800'
            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${isActive ? 'bg-fin-accent text-white' : 'bg-fin-700 text-gray-400'}`}>
                    #{index + 1}
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {slide.estimatedDuration}
                </span>
            </div>
            <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">{slide.title}</h3>
            <p className="text-xs text-gray-400 line-clamp-3">
                {slide.bulletPoints.join(' • ')}
            </p>
        </div>
    );
};