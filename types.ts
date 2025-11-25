export interface Slide {
    title: string;
    bulletPoints: string[];
    speakerNotes: string; // The script for the presenter
    visualSuggestion: string; // Suggestion for chart/image
    estimatedDuration: string; // e.g., "3 mins"
}

export interface Presentation {
    topic: string;
    totalDuration: string;
    slides: Slide[];
}

export enum GeneratorStatus {
    IDLE = 'IDLE',
    GENERATING = 'GENERATING',
    COMPLETE = 'COMPLETE',
    ERROR = 'ERROR'
}