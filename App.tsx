import React, { useState, useCallback } from 'react';
import { generateLessonPlan, generateSectionImages } from './services/geminiService';
import { LoadingStage, LessonData } from './types';
import LoadingIndicator from './components/LoadingIndicator';
import LessonView from './components/LessonView';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [stage, setStage] = useState<LoadingStage>(LoadingStage.IDLE);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStage(LoadingStage.RESEARCHING);
    setErrorMsg(null);
    setLessonData(null);

    try {
      // Step 1: Research & Structure Planning
      const { topic: safeTopic, intro, rawSections, sources } = await generateLessonPlan(topic);
      
      setStage(LoadingStage.WRITING); // Briefly show writing/structuring
      
      // Step 2: Parallel Image Generation
      setStage(LoadingStage.DESIGNING);
      
      // Generate images for all 3 sections at once
      const sectionsWithImages = await generateSectionImages(rawSections);
      
      setLessonData({
        topic: safeTopic,
        intro,
        sections: sectionsWithImages,
        sources
      });

      setStage(LoadingStage.COMPLETED);

    } catch (error) {
      console.error(error);
      setStage(LoadingStage.ERROR);
      setErrorMsg("Ocurrió un error al intentar generar la lección. Por favor, intenta de nuevo o prueba con otro tema.");
    }
  }, [topic]);

  const handleReset = () => {
    setTopic('');
    setStage(LoadingStage.IDLE);
    setLessonData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Header / Nav */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white text-lg font-bold">T</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600">
              Tutor Multimedia
            </h1>
          </div>
          <nav className="hidden md:flex gap-4 text-sm font-medium text-slate-500">
            <span className="cursor-default">v2.0</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Intro / Search State */}
        {stage === LoadingStage.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
             <div className="space-y-4 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Aprende cualquier tema <br/>
                  <span className="text-indigo-600">Visualmente</span>
                </h2>
                <p className="text-lg text-slate-600">
                  Escribe un tema y crearé una guía paso a paso con imágenes exclusivas para ti.
                </p>
             </div>

             <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
               <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 border border-slate-100">
                 <div className="pl-4 text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ej. Criptomonedas, El Sistema Solar, Impresionismo..."
                    className="flex-1 p-4 bg-transparent outline-none text-lg text-slate-800 placeholder:text-slate-400"
                    autoFocus
                 />
                 <button 
                    type="submit"
                    disabled={!topic.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Enseñar
                 </button>
               </div>
             </form>

             {/* Features Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl text-left">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    📚
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Multi-Sección</h3>
                  <p className="text-sm text-slate-500">La lección se divide en conceptos clave organizados para fácil lectura.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                    ✨
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Sin Ruido</h3>
                  <p className="text-sm text-slate-500">Texto limpio, directo y sin tecnicismos innecesarios.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                    🖼️
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Múltiples Imágenes</h3>
                  <p className="text-sm text-slate-500">Generamos una ilustración única para cada definición o concepto.</p>
                </div>
             </div>
          </div>
        )}

        {/* Loading State */}
        {(stage === LoadingStage.RESEARCHING || stage === LoadingStage.WRITING || stage === LoadingStage.DESIGNING) && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
             <LoadingIndicator stage={stage} />
             {stage === LoadingStage.DESIGNING && (
               <p className="mt-4 text-slate-400 text-sm animate-pulse">Generando múltiples ilustraciones...</p>
             )}
          </div>
        )}

        {/* Error State */}
        {stage === LoadingStage.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center">
             <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 text-4xl">
               ⚠️
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">Algo salió mal</h3>
             <p className="text-slate-600 mb-8 max-w-md">{errorMsg}</p>
             <button 
                onClick={handleReset}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
             >
                Intentar de nuevo
             </button>
          </div>
        )}

        {/* Result State */}
        {stage === LoadingStage.COMPLETED && lessonData && (
          <LessonView data={lessonData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;