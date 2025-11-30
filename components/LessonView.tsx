import React from 'react';
import { LessonData } from '../types';

interface LessonViewProps {
  data: LessonData;
  onReset: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ data, onReset }) => {
  
  // Clean text function to remove Markdown artifacts like ** or ##
  const cleanText = (text: string) => {
    return text
      .replace(/\*\*/g, '') // Remove double asterisks
      .replace(/\*/g, '')   // Remove single asterisks
      .replace(/##/g, '')   // Remove hashes
      .replace(/__/g, '');  // Remove underscores
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up pb-12">
      
      {/* Header / Intro Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 md:p-10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 relative z-10">
          {cleanText(data.topic)}
        </h1>
        <div className="text-lg md:text-xl text-slate-600 leading-relaxed relative z-10">
          {cleanText(data.intro)}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-12">
        {data.sections.map((section, index) => (
          <div key={index} className="flex flex-col bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden">
            
            {/* Section Header */}
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-bold text-slate-800">
                  {cleanText(section.title)}
                </h2>
              </div>
            </div>

            {/* Content Container (Image + Text) */}
            <div className="flex flex-col md:grid md:grid-cols-2">
              
              {/* Image Column */}
              <div className={`relative min-h-[250px] bg-slate-50 flex items-center justify-center p-4 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                {section.imageUrl ? (
                   <img 
                    src={section.imageUrl} 
                    alt={section.title}
                    className="w-full h-full object-contain max-h-[300px] rounded-lg shadow-sm"
                   />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🖼️</span>
                    <span className="text-sm">Generando visualización...</span>
                  </div>
                )}
              </div>

              {/* Text Column */}
              <div className={`p-8 flex items-center ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {cleanText(section.content)}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Footer / Sources */}
      <div className="mt-12 bg-slate-50 rounded-2xl p-8 border border-slate-200">
          {data.sources.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Fuentes Verificadas
              </h4>
              <div className="flex flex-wrap gap-3">
                {data.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 text-sm transition-colors border border-slate-200 shadow-sm"
                  >
                    <span className="truncate max-w-[200px]">{source.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-200 gap-4">
            <button 
              onClick={onReset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Aprender otro tema
            </button>
            <span className="text-xs text-slate-400 font-medium">
              Potenciado por Gemini 2.5 • Investigación en tiempo real
            </span>
          </div>
      </div>
    </div>
  );
};

export default LessonView;