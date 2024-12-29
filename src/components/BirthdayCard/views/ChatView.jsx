import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Image, Smile, Search, Heart, Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

const VideoPreview = ({ video, onClick, className }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [poster, setPoster] = useState('');

  useEffect(() => {
    const captureFirstFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const posterUrl = canvas.toDataURL('image/jpeg');
        setPoster(posterUrl);
      }
    };

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.preload = "metadata";
      
      video.addEventListener('loadeddata', captureFirstFrame);
      return () => {
        video.removeEventListener('loadeddata', captureFirstFrame);
      };
    }
  }, [video]);

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <canvas ref={canvasRef} className="hidden" />
      <video
        ref={videoRef}
        src={video}
        className="hidden"
        playsInline
        muted
      />
      <div className="relative w-full h-full rounded-lg overflow-hidden cursor-pointer group">
        <video
          src={video}
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          preload="none"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="relative z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm">
            <Play className="w-5 h-5 text-white translate-x-0.5" />
          </div>
        </div>
        <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-md">
          <Play className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

const MediaModal = ({ media, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (media.type === 'video') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-[350px] aspect-[9/16]">
          <video
            ref={videoRef}
            src={media.url}
            className="w-full h-full object-contain"
            loop
            playsInline
            muted={isMuted}
            autoPlay
            onClick={handlePlayPause}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button onClick={handlePlayPause} className="p-2 rounded-full bg-black/50 hover:bg-black/70">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white translate-x-0.5" />
              )}
            </button>
            <button onClick={handleMuteToggle} className="p-2 rounded-full bg-black/50 hover:bg-black/70">
              {isMuted ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
        <X className="w-6 h-6" />
      </button>
      <img src={media.url} alt={media.caption || ""} className="max-h-[90vh] max-w-[90vw] object-contain" />
    </div>
  );
};

const ChatView = ({ memory, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!selectedDate && memory.conversations.length > 0) {
      setSelectedDate(memory.conversations[0]);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedDate, memory.conversations]);

  const filteredConversations = memory.conversations.filter(conv => 
    conv.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#E6E6FA] w-full max-w-5xl mx-auto h-[80vh] rounded-lg shadow-xl flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par date..."
              className="bg-transparent text-sm focus:outline-none w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv, index) => (
            <div
              key={index}
              onClick={() => setSelectedDate(conv)}
              className={`p-4 cursor-pointer hover:bg-[#E6E6FA]/20 transition-colors
                ${selectedDate === conv ? 'bg-[#E6E6FA]/30' : ''}`}
            >
              <div className="font-medium">{conv.date}</div>
              <div className="text-sm text-gray-500 truncate">
                {conv.messages[conv.messages.length - 1].text || 'Media message'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedDate ? (
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-4 py-3 border-b bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                <img 
                  src={memory.mariemImage || "/api/placeholder/40/40"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-medium">Moonleesi</h2>
                <p className="text-xs text-gray-500">Active il y a 2h</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 bg-[#E6E6FA]/10 space-y-4">
            {selectedDate.messages.map((msg, index) => (
              <div 
                key={index}
                className="animate-message-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'} mb-1 items-end gap-2`}>
                  {msg.sender === 'her' && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={memory.mariemImage || "/api/placeholder/32/32"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div 
                    className={`relative max-w-[70%] rounded-2xl
                      ${msg.sender === 'you' ? 'bg-[#E6E6FA] text-black' : 'bg-gray-100 text-black'}
                      ${msg.media ? 'p-1 overflow-hidden w-48' : 'px-4 py-2'}`}
                  >
                    {msg.media ? (
                      <div className="w-full">
                        {msg.media.type === 'video' ? (
                          <VideoPreview
                            video={msg.media.url}
                            onClick={() => setSelectedMedia(msg.media)}
                            className="w-full h-48"
                          />
                        ) : (
                          <img
                            src={msg.media.url}
                            alt={msg.media.caption || ""}
                            className="w-full rounded-lg cursor-pointer"
                            onClick={() => setSelectedMedia(msg.media)}
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-[15px]">{msg.text}</p>
                    )}
                  </div>
                </div>
                {msg.liked && (
                  <div className={`flex ${msg.sender === 'you' ? 'justify-end mr-2' : 'justify-start ml-10'} mt-1`}>
                    <Heart className="w-4 h-4 text-purple-500 fill-current" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t bg-white">
            <div className="flex items-center gap-3 bg-[#E6E6FA]/20 rounded-full px-4 py-2">
              <Smile className="w-6 h-6 text-gray-400" />
              <input 
                type="text"
                placeholder="Aa"
                className="flex-1 bg-transparent text-[15px] focus:outline-none placeholder-gray-400"
              />
              <Image className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-white">
          Sélectionnez une date pour voir la conversation
        </div>
      )}

      {/* Media Modal */}
      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}

      <style jsx>{`
        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-message-in {
          opacity: 0;
          animation: messageIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatView;