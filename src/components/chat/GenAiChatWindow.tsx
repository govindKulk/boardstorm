// src/components/GenAIChatWindow.tsx
'use client'; // Mark as Client Component

import React, { useState } from 'react';
import { X, Send } from 'lucide-react'; // Example icons
import toast from 'react-hot-toast';

interface GenAIChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (json: any) => void; // Callback to pass generated JSON
}

const GenAIChatWindow: React.FC<GenAIChatWindowProps> = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if(response.status == 429){
          toast.error("Rate limited.. Only 1 request per minute" + `\n ${errorData.error}}`)
        }else{
          toast.error("Something unexpected occured")
        }
        throw new Error(errorData.error || 'Failed to generate diagram.');
      }

      const data = await response.json();
      onGenerate(data); // Pass the generated JSON to the parent
      setPrompt(''); // Clear prompt
      onClose(); // Close the chat window
    } catch (err: any) {
      console.error('Error generating diagram:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 w-80  bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-indigo-500 text-white rounded-t-lg">
        <h3 className="text-lg font-semibold">AI Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-gray-100 focus:outline-none">
          <X size={20} />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <p className="text-sm text-gray-600 mb-4">
          Enter a prompt to generate a diagram (e.g., "create a flowchart for user login" or "draw a simple house").
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm" role="alert">
            {error}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your diagram request..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenAIChatWindow;