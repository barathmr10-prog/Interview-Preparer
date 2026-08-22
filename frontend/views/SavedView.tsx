import React, { useState, useEffect } from 'react';
import { QAItem, User } from '../types';
import { getSavedItems, deleteItem } from '../services/storageService';
import { speakText, stopSpeaking } from '../services/ttsService';
import { SearchIcon, PlayIcon, StopIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, SaveIcon } from '../components/Icons';

const QATile: React.FC<{ 
  item: QAItem; 
  onDelete: (id: string) => void;
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: (id: string | null) => void;
}> = ({ item, onDelete, currentlyPlayingId, setCurrentlyPlayingId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPlaying = currentlyPlayingId === item.id;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding/collapsing when clicking play
    
    if (isPlaying) {
      stopSpeaking();
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(item.id);
      const textToSpeak = `Question: ${item.question}. Answer: ${item.answer}`;
      speakText(textToSpeak, () => {
        // Only reset if this item is still the one playing
        setCurrentlyPlayingId((current) => current === item.id ? null : current);
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
      setCurrentlyPlayingId(null);
    }
    onDelete(item.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      <div 
        className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 line-clamp-2 text-base">{item.question}</h4>
          <p className="text-xs text-gray-500 mt-1.5">
            {new Date(item.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePlayToggle}
            className={`p-2.5 rounded-full transition-colors ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            title={isPlaying ? "Stop" : "Play Audio"}
          >
            {isPlaying ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDelete}
            className="p-2.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
          <div className="p-1.5 text-gray-400">
            {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-0 border-t border-gray-100 bg-gray-50">
          <div className="mt-4">
            <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Answer</h5>
            <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface SavedViewProps {
  currentUser: User;
}

const SavedView: React.FC<SavedViewProps> = ({ currentUser }) => {
  const [items, setItems] = useState<QAItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setItems(getSavedItems(currentUser.id));
    return () => {
      stopSpeaking();
    };
  }, [currentUser.id]);

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    setItems(getSavedItems(currentUser.id));
  };

  const filteredItems = items.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 mb-2 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Saved Library</h2>
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 sm:py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-colors"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
          <SaveIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No saved items yet</h3>
          <p className="mt-2 text-gray-500 text-sm">Go to the Home tab to ask and save some questions.</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found for "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {filteredItems.map(item => (
            <QATile 
              key={item.id} 
              item={item} 
              onDelete={handleDeleteItem}
              currentlyPlayingId={currentlyPlayingId}
              setCurrentlyPlayingId={setCurrentlyPlayingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedView;
