export interface Source {
  title: string;
  uri: string;
}

export interface LessonSection {
  title: string;
  content: string;
  visualPrompt: string;
  imageUrl?: string;
}

export interface LessonData {
  topic: string;
  intro: string;
  sections: LessonSection[];
  sources: Source[];
}

export enum LoadingStage {
  IDLE = 'IDLE',
  RESEARCHING = 'RESEARCHING', // Searching web
  WRITING = 'WRITING', // Pedagogical text generation
  DESIGNING = 'DESIGNING', // Generating images
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}