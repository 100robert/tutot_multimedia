import React from 'react';
import { LoadingStage } from '../types';

interface LoadingIndicatorProps {
  stage: LoadingStage;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ stage }) => {
  const steps = [
    { id: LoadingStage.RESEARCHING, label: "Investigando fuentes fiables...", icon: "🔍" },
    { id: LoadingStage.WRITING, label: "Redactando explicación pedagógica...", icon: "✍️" },
    { id: LoadingStage.DESIGNING, label: "Diseñando material visual...", icon: "🎨" },
  ];

  // Determine active index based on enum order logic or simplified mapping
  const stageOrder = [LoadingStage.RESEARCHING, LoadingStage.WRITING, LoadingStage.DESIGNING, LoadingStage.COMPLETED];
  const currentIndex = stageOrder.indexOf(stage);

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-center text-slate-700 font-semibold mb-6">Creando tu lección...</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          let statusClass = "text-slate-400"; // Pending
          let iconClass = "grayscale opacity-50";
          
          if (index < currentIndex) {
             statusClass = "text-green-600 font-medium"; // Completed
             iconClass = "text-green-500";
          } else if (index === currentIndex) {
             statusClass = "text-blue-600 font-semibold animate-pulse"; // Active
             iconClass = "text-blue-500 scale-110 transform duration-300";
          }

          return (
            <div key={step.id} className={`flex items-center gap-4 transition-all duration-500 ${statusClass}`}>
              <div className={`w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-xl shadow-sm border border-slate-100 ${iconClass}`}>
                {index < currentIndex ? "✅" : step.icon}
              </div>
              <span className="text-sm md:text-base">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingIndicator;