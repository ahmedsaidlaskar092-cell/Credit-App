import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { marked } from 'marked';

interface GeminiAnalysisModalProps {
  isLoading: boolean;
  analysisResult: string | null;
  onClose: () => void;
  title: string;
}

const GeminiAnalysisModal: React.FC<GeminiAnalysisModalProps> = ({ isLoading, analysisResult, onClose, title }) => {
  const formattedResult = analysisResult ? marked.parse(analysisResult) : '';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative flex flex-col max-h-[80vh] animate-fade-in-scale">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <div className="flex items-center mb-4">
          <Sparkles className="text-blue-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-4 text-gray-600 font-semibold">Gemini is thinking...</p>
              <p className="mt-2 text-sm text-gray-500">Analyzing your data for valuable insights.</p>
            </div>
          )}
          {analysisResult && (
             <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formattedResult }} />
          )}
          {!isLoading && !analysisResult && (
            <div className="text-center text-gray-500">
              <p>No analysis available. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiAnalysisModal;