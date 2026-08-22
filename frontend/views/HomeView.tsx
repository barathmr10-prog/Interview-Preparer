import React, { useState, useEffect } from 'react';
import { generateInterviewAnswer } from '../services/geminiService';
import { saveItem } from '../services/storageService';
import { speakText, stopSpeaking } from '../services/ttsService';
import { PlayIcon, StopIcon, SaveIcon } from '../components/Icons';
import { QAItem, User } from '../types';

interface HomeViewProps {
  currentUser: User;
}

const HomeView: React.FC<HomeViewProps> = ({ currentUser }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleSend = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    setError('');
    setAnswer('');
    setIsSaved(false);
    stopSpeaking();
    setIsPlaying(false);

    try {
      const generatedAnswer = await generateInterviewAnswer(question);
      setAnswer(generatedAnswer);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleListen = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const textToSpeak = `Question: ${question}. Answer: ${answer}`;
      speakText(textToSpeak, () => setIsPlaying(false));
    }
  };

  const handleSave = () => {
    if (!question || !answer) return;
    
    const newItem: QAItem = {
      id: Date.now().toString(),
      userId: currentUser.id,
      question: question.trim(),
      answer: answer.trim(),
      timestamp: Date.now(),
    };
    
    saveItem(newItem);
    setIsSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Please type your questions below to update your knowledge</h2>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-base"
          rows={5}
          placeholder="e.g., Tell me about a time you had to overcome a significant challenge at work..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSend}
            disabled={isLoading || !question.trim()}
            className={`w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2
              ${isLoading || !question.trim() 
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Get Answer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {answer && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Suggested Answer</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleListen}
                className={`flex-1 sm:flex-none p-3 sm:p-2 rounded-xl sm:rounded-full transition-colors flex items-center justify-center gap-2 text-sm font-medium
                  ${isPlaying ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                title={isPlaying ? "Stop listening" : "Listen to Q&A"}
              >
                {isPlaying ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                <span>{isPlaying ? 'Stop' : 'Listen'}</span>
              </button>

              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`flex-1 sm:flex-none p-3 sm:p-2 rounded-xl sm:rounded-full transition-colors flex items-center justify-center gap-2 text-sm font-medium
                  ${isSaved ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title="Save to library"
              >
                <SaveIcon className="w-5 h-5" />
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>
          <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap text-base leading-relaxed">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
