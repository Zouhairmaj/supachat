import React from 'react';
import { Bot } from 'lucide-react';
import type { TeamMember } from '../../utils/teamMembers';

interface MentionSuggestionsProps {
  suggestions: (TeamMember | { id: string; name: string; isAI: boolean })[];
  onSelect: (suggestion: TeamMember | { id: string; name: string; isAI: boolean }) => void;
  activeIndex: number;
}

export function MentionSuggestions({ suggestions, onSelect, activeIndex }: MentionSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-48 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion.id}
          className={`w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-gray-50 ${
            index === activeIndex ? 'bg-gray-50' : ''
          }`}
          onClick={() => onSelect(suggestion)}
        >
          {'isAI' in suggestion ? (
            <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
              {suggestion.avatar ? (
                <img src={suggestion.avatar} alt={suggestion.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm">{suggestion.name.charAt(0)}</span>
              )}
            </div>
          )}
          <span className="text-sm text-gray-900">{suggestion.name}</span>
          {'isAI' in suggestion && (
            <span className="ml-auto text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-full">
              AI
            </span>
          )}
        </button>
      ))}
    </div>
  );
}