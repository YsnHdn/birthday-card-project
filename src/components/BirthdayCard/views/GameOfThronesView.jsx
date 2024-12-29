// GameOfThronesView.jsx - Complete updated file:

import React, { useState } from 'react';
import { ArrowLeft, X, Book } from 'lucide-react';

const EndingModal = ({ onClose, onSelectEnding, endings }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] animate-fade-in">
    <div className="relative max-w-2xl bg-[#2C1810] p-8 rounded-lg text-center space-y-8 border border-[#D4B483]/30">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-[#D4B483]/70 hover:text-[#D4B483]"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-3xl text-[#D4B483] font-cinzel">Hellooo Moonleesi</div>

      <p className="text-[#D4B483]/90 font-fell">
        Since we haven't discussed bzzaf dlHwayej après l'ending . I wanted to write you something , li kunt bghit ngoulehom lik
        ch7al hadi fach kuna kantferjou. u puisque 3ziz elik bzzaf Game of thrones , derteha ela chkel Library b7al ida Sam li ki9ra fiha 😂😂😂
      </p>

      <div className="grid gap-4">
        {endings.map((ending, index) => (
          <button
            key={index}
            onClick={() => onSelectEnding(ending.title)}
            className="p-4 border border-[#D4B483]/30 rounded-lg text-left hover:bg-[#D4B483]/10 
              transition-colors group"
          >
            <h3 className="text-[#D4B483] font-cinzel text-xl mb-2">{ending.title}</h3>
            <p className="text-[#D4B483]/70 font-fell italic">{ending.description}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const StoryBook = ({ title, date, caption, onClick, coverImage }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
  >
    <div className="w-48 h-64 rounded-lg relative shadow-xl transform transition-all duration-500 
      hover:rotate-y-[-5deg] group-hover:-translate-y-2"
      style={{
        background: `linear-gradient(45deg, #2C1810 0%, #4A2F23 100%)`,
        boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'
      }}>
      {/* Cover image */}
      <div className="absolute inset-0">
        <img 
          src={coverImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1810]/50 to-[#2C1810]/90" />
      </div>
      
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`
        }}
      />
      
      <div className="absolute top-4 left-2 right-2 h-[1px] bg-[#D4B483]/80" />
      <div className="absolute bottom-4 left-2 right-2 h-[1px] bg-[#D4B483]/80" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <Book className="w-8 h-8 text-[#D4B483] mb-3 opacity-80" />
        <h3 className="font-cinzel text-[#D4B483] text-lg mb-2"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>{title}</h3>
        <p className="font-fell text-[#D4B483]/70 text-sm">{date}</p>
      </div>
    </div>
  </div>
);

const StoryDetail = ({ memory, onClose }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-8 z-50">
    <div className="relative max-w-5xl w-full bg-[#F5E6D3] rounded-lg shadow-2xl"
      style={{
        backgroundImage: `
          linear-gradient(rgba(245, 230, 211, 0.97), rgba(245, 230, 211, 0.97)),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")
        `
      }}>
      <button 
        onClick={onClose}
        className="absolute -top-12 right-0 text-[#D4B483] hover:text-[#E5C8A6]"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="flex">
        <div className="flex-1 p-8 border-r border-[#8B4513]/20">
          <div className="aspect-square mb-4 shadow-xl overflow-hidden rounded-lg">
            <img 
              src={memory.coverImage}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center space-y-2 mt-6">
            <p className="font-fell text-[#3C2415]">{memory.date}</p>
            <p className="font-fell italic text-[#3C2415]">{memory.caption}</p>
          </div>
        </div>

        <div className="flex-1 p-8">
          <h2 className="font-cinzel text-3xl text-[#2C1810] mb-6 text-center">{memory.title}</h2>
          <div className="font-fell text-[#3C2415] space-y-4 leading-relaxed">
            <p className="first-letter:text-4xl first-letter:font-cinzel first-letter:mr-1 first-letter:float-left">
              {memory.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GameOfThronesView = ({ memory, onBack }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEndingModal, setShowEndingModal] = useState(true);
  const [selectedEnding, setSelectedEnding] = useState(null);
  
  const handleSelectEnding = (ending) => {
    setSelectedEnding(ending);
    setShowEndingModal(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden"
      style={{
        background: `
          linear-gradient(rgba(28, 17, 10, 0.95), rgba(28, 17, 10, 0.95)),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")
        `
      }}>
      {showEndingModal && (
        <EndingModal
          onClose={() => setShowEndingModal(false)}
          onSelectEnding={handleSelectEnding}
          endings={memory.endings}
        />
      )}

      <div className="relative w-full h-full p-12">
        <button 
          onClick={onBack}
          className="absolute left-4 top-4 p-2 hover:bg-white/10 rounded-full z-40 text-[#D4B483]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-center font-cinzel text-[#D4B483] text-4xl mb-16">
         Library {selectedEnding && ` - ${selectedEnding}`}
        </h1>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {memory.books.map((book, index) => (
            <StoryBook
              key={index}
              {...book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>
      </div>

      {selectedBook && (
        <StoryDetail 
          memory={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&display=swap');

        .font-cinzel {
          font-family: 'Cinzel', serif;
        }

        .font-fell {
          font-family: 'IM Fell English', serif;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameOfThronesView;