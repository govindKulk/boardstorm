// src/components/GenAIFloater.tsx
'use client'; // Mark as Client Component

import React from 'react';
import { Star } from 'lucide-react'; // Example icon, install lucide-react if not already

interface GenAIFloaterProps {
  onClick: () => void;
}

const GenAIFloater: React.FC<GenAIFloaterProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 z-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      aria-label="Open AI Assistant"
    >
      <Star size={24} /> {/* Star icon */}
    </button>
  );
};

export default GenAIFloater;