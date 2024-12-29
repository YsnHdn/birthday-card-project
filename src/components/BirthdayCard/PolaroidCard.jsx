// src/components/BirthdayCard/PolaroidCard.jsx
import React from 'react';

const PolaroidCard = ({ 
  title, 
  date, 
  caption,
  image,
  onClick,
  show 
}) => {
  if (!show) return null;

  return (
    <div 
      className="w-64 bg-white p-4 rounded-sm cursor-pointer group"
      style={{ 
        filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.08))'
      }}
      onClick={onClick}
    >
      <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center space-y-1">
        <p className="font-handwriting text-xl text-gray-800">{title}</p>
        <p className="font-handwriting text-sm text-gray-800">{date}</p>
        <p className="text-purple-400 text-sm italic">{caption}</p>
      </div>
    </div>
  );
};

export default PolaroidCard;