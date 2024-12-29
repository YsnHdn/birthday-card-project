import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import PolaroidCard from './PolaroidCard';
import ChatView from './views/ChatView';
import BookView from './views/BookView';
import GameOfThronesView from './views/GameOfThronesView';
import { memories } from '../../data/memories';
import SpotifyView from './views/SpotifyView';
import GalleryView from './views/FlowersView';

const BirthdayCard = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [visiblePolaroids, setVisiblePolaroids] = useState([0]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    // Animation sequence for polaroids appearing
    memories.forEach((_, index) => {
      if (index === 0) return;
      setTimeout(() => {
        setVisiblePolaroids(prev => [...prev, index]);
      }, 500 * index);
    });
  }, []);

  // Positions for scattered polaroids
  const scatteredPositions = [
    { x: 'left-[20%]', y: 'top-[12%]', rotate: '-rotate-[15deg]' },   // Top left
    { x: 'left-[45%]', y: 'top-[8%]', rotate: 'rotate-[10deg]' },    // Top center
    { x: 'left-[70%]', y: 'top-[15%]', rotate: '-rotate-[8deg]' },   // Top right
    { x: 'left-[25%]', y: 'top-[35%]', rotate: 'rotate-[12deg]' },   // Middle left
    { x: 'left-[55%]', y: 'top-[32%]', rotate: '-rotate-[5deg]' },   // Middle right
    { x: 'left-[35%]', y: 'top-[42%]', rotate: '-rotate-[20deg]' },  // Bottom center
  ];

  // Get style for each card
  const getCardStyle = (index) => {
    const position = scatteredPositions[index % scatteredPositions.length];
    const delay = `${index * 0.5}s`;

    return {
      x: position.x,
      y: position.y,
      rotation: position.rotate,
      delay
    };
  };

  // Render the selected view (Chat, Book, or Game of Thrones)
  const renderSelectedView = () => {
    const memory = memories.find(m => m.id === selectedDate);
    if (!memory) return null;

    const props = {
      memory,
      onBack: () => setSelectedDate(null)
    };

    switch (memory.type) {
      case 'chat':
        return <ChatView {...props} />;
      case 'book':
        return <BookView {...props} />;
      case 'got':
        return <GameOfThronesView {...props} />;
      case 'spotify':
        return <SpotifyView {...props} />;
      case 'gallery':
        return <GalleryView {...props} />;
      default:
        return <div>Vue standard</div>;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8 overflow-hidden">
      {!selectedDate ? (
        // Grid of Polaroid cards
        <div className="max-w-7xl mx-auto relative h-full">
          <div className="text-center mb-8">
            <h1 className="text-purple-600 text-3xl flex items-center justify-center gap-3">
              <Camera className="text-purple-500" />
              Notre Histoire en Photos
              <Camera className="text-purple-500 transform -scale-x-100" />
            </h1>
          </div>

          <div className="relative w-full h-[calc(100vh-150px)]">
            {memories.map((memory, index) => {
              const style = getCardStyle(index);
              return visiblePolaroids.includes(index) && (
                <div
                  key={memory.id}
                  className={`absolute ${style.x} ${style.y} -translate-x-1/2 
                    opacity-0 animate-float-in cursor-pointer
                    transition-all duration-500 ease-in-out`}
                  style={{ 
                    zIndex: hoveredIndex === index ? 50 : memories.length - index,
                    '--rotation-value': style.rotation,
                    '--float-delay': style.delay
                  }}
                  onClick={() => setSelectedDate(memory.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div 
                    className={`transform ${style.rotation} transition-all duration-300 ease-in-out
                      hover:scale-110 hover:rotate-0 hover:shadow-xl shadow-md`}
                  >
                    <PolaroidCard 
                      {...memory}
                      onClick={() => setSelectedDate(memory.id)}
                      show={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Selected memory view (Chat, Book, or Game of Thrones)
        <div className="w-full h-full flex items-center justify-center">
          {renderSelectedView()}
        </div>
      )}

      <style jsx>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(50px) rotate(var(--rotation-value, 0deg));
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(var(--rotation-value, 0deg));
          }
        }

        .animate-float-in {
          animation: floatIn 1.5s ease-out forwards;
          animation-delay: var(--float-delay, 0s);
        }
      `}</style>
    </div>
  );
};

export default BirthdayCard;