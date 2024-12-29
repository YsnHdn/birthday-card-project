import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const BookView = ({ memory, onBack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [transitionState, setTransitionState] = useState('');
  const maxPages = memory.content.pages.length;

  const handleNext = () => {
    if (isFlipping || currentPage >= maxPages - 2) return;
    setIsFlipping(true);
    setTransitionState('pageFlippingForward');
    setTimeout(() => {
      setCurrentPage(prev => prev + 2);
      setTransitionState('');
      setIsFlipping(false);
    }, 500);
  };

  const handlePrev = () => {
    if (isFlipping || currentPage <= 0) return;
    setIsFlipping(true);
    setTransitionState('pageFlippingBackward');
    setTimeout(() => {
      setCurrentPage(prev => prev - 2);
      setTransitionState('');
      setIsFlipping(false);
    }, 500);
  };

  const handleOpenBook = () => {
    setTransitionState('coverOpening');
    setTimeout(() => {
      setIsOpen(true);
      setCurrentPage(0);
      setTransitionState('pagesAppearing');
      setTimeout(() => setTransitionState(''), 500);
    }, 500);
  };

  const handleCloseBook = () => {
    setTransitionState('pagesDisappearing');
    setTimeout(() => {
      setIsOpen(false);
      setTransitionState('coverClosing');
      setTimeout(() => setTransitionState(''), 500);
    }, 500);
  };

  const getPageContent = (pageIndex) => {
    if (pageIndex >= maxPages) return null;
    const content = memory.content.pages[pageIndex];
    if (!content) return null;

    const firstLetter = content.charAt(0);
    const restOfContent = content.slice(1);

    return (
      <div className="relative text-left px-4">
        <span className="float-left text-7xl font-serif mr-3 mt-1 text-[#2c1810] leading-[0.8]">
          {firstLetter}
        </span>
        <span className="font-indie text-xl leading-relaxed text-[#2c1810]">
          {restOfContent}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-pink-50/50">
      <button 
        onClick={onBack}
        className="absolute left-4 top-4 p-2 hover:bg-black/5 rounded-full z-50"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-5xl mx-auto perspective">
        <div className={`relative mx-auto ${isOpen ? 'w-[800px]' : 'w-[400px]'} h-[500px] transition-all duration-500`}>
          {!isOpen ? (
            // Cover
            <div 
              className={`absolute inset-0 cursor-pointer book-cover
                ${transitionState === 'coverOpening' ? 'opening' : ''}
                ${transitionState === 'coverClosing' ? 'closing' : ''}`}
              onClick={handleOpenBook}
            >
              <div className="w-full h-full bg-[#1A0F0A] rounded-lg shadow-xl overflow-hidden flex flex-col">
                {/* Cover Image */}
                <div className="relative h-[60%] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/20 via-[#1A0F0A]/50 to-[#1A0F0A] z-10" />
                  <div className="absolute inset-0">
                    <img 
                      src={memory.coverImage || "/api/placeholder/400/300"} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                      style={{ objectPosition: '50% +30%' }}
                    />
                  </div>
                </div>

                {/* Cover Text */}
                <div className="relative flex-1 flex flex-col items-center justify-center text-center px-8">
                  <span className="text-[#D4B483]/80 text-sm tracking-[0.5em] uppercase mt-4">
                    Memories
                  </span>
                  <h1 className="text-[#E5C8A6] text-4xl font-indie tracking-wide mb-3">
                    {memory.title}
                  </h1>
                  <p className="text-[#BC9370] text-lg tracking-wider mb-6">
                    {memory.date}
                  </p>
                  <button className="text-[#D4B483] text-sm tracking-[0.25em] uppercase py-2 px-8 border-t border-b border-[#D4B483]/30 hover:text-[#E5C8A6] hover:border-[#E5C8A6]/50 transition-all duration-300">
                    Ouvrir le livre
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Open Book Content
            <div className={`absolute inset-0 book-content
              ${transitionState === 'pagesAppearing' ? 'appearing' : ''}
              ${transitionState === 'pagesDisappearing' ? 'disappearing' : ''}`}
            >
              <div className="absolute inset-0 flex">
                {/* Left Page */}
                <div className="w-1/2 bg-[#f4e4bc] p-8 shadow-inner">
                  <div className="text-center">
                    {getPageContent(currentPage)}
                  </div>
                  <div className="absolute bottom-4 left-8 text-[#2c1810]/50">
                    {currentPage + 1}
                  </div>
                </div>
                {/* Right Page */}
                <div className="w-1/2 bg-[#f4e4bc] p-8 shadow-inner">
                  <div className="text-center">
                    {getPageContent(currentPage + 1)}
                  </div>
                  <div className="absolute bottom-4 right-8 text-[#2c1810]/50">
                    {currentPage + 2}
                  </div>
                </div>
              </div>

              {/* Flipping Page Animation */}
              {isFlipping && (
                <div className={`absolute right-0 w-1/2 h-full page-flip 
                  ${transitionState === 'pageFlippingForward' ? 'flipping-forward' : ''}
                  ${transitionState === 'pageFlippingBackward' ? 'flipping-backward' : ''}`}>
                  <div className="absolute inset-0 bg-[#f4e4bc] p-8 text-center page-front">
                    {getPageContent(currentPage + 2)}
                  </div>
                  <div className="absolute inset-0 bg-[#f4e4bc] p-8 text-center page-back">
                    {getPageContent(currentPage + 3)}
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                <button 
                  onClick={handlePrev}
                  className={`${currentPage <= 0 ? 'opacity-30' : 'hover:text-gray-900'}`}
                  disabled={currentPage <= 0 || isFlipping}
                >
                  ←
                </button>
                <span className="text-sm text-gray-600">
                  Pages {currentPage + 1}-{currentPage + 2}
                </span>
                <button 
                  onClick={handleNext}
                  className={`${currentPage >= maxPages - 2 ? 'opacity-30' : 'hover:text-gray-900'}`}
                  disabled={currentPage >= maxPages - 2 || isFlipping}
                >
                  →
                </button>
                <button
                  onClick={handleCloseBook}
                  className="ml-4 px-3 py-1 bg-[#3D2317] text-[#D4B483] rounded hover:bg-[#2a1910]"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
        
        .font-indie {
          font-family: 'Indie Flower', cursive;
        }

        .perspective {
          perspective: 2000px;
        }

        .book-cover {
          transform: rotateY(0) rotateX(10deg);
          transition: transform 0.5s ease-out;
        }

        .book-cover.opening {
          transform: rotateY(-180deg) rotateX(10deg);
        }

        .book-cover.closing {
          transform: rotateY(0) rotateX(10deg);
        }

        .book-content {
          transform: rotateX(10deg);
          opacity: 1;
          transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }

        .book-content.appearing {
          animation: appearContent 0.5s ease-out forwards;
        }

        .book-content.disappearing {
          animation: disappearContent 0.5s ease-out forwards;
        }

        .page-flip {
          transform-origin: left;
          transform-style: preserve-3d;
        }

        .page-flip.flipping-forward {
          animation: flipForward 0.5s ease-in-out;
        }

        .page-flip.flipping-backward {
          animation: flipBackward 0.5s ease-in-out;
        }

        .page-front, .page-back {
          backface-visibility: hidden;
        }

        .page-back {
          transform: rotateY(180deg);
        }

        @keyframes appearContent {
          from {
            opacity: 0;
            transform: rotateX(10deg) translateY(100px);
          }
          to {
            opacity: 1;
            transform: rotateX(10deg) translateY(0);
          }
        }

        @keyframes disappearContent {
          from {
            opacity: 1;
            transform: rotateX(10deg) translateY(0);
          }
          to {
            opacity: 0;
            transform: rotateX(10deg) translateY(100px);
          }
        }

        @keyframes flipForward {
          from { transform: rotateY(0); }
          to { transform: rotateY(-180deg); }
        }

        @keyframes flipBackward {
          from { transform: rotateY(-180deg); }
          to { transform: rotateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BookView;