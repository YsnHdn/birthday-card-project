import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, Heart, MessageCircle, Bookmark, Send, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const MediaContent = ({ post, inModal = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayPause = async (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
          setIsPlaying(false);
        } else {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            await playPromise;
            setIsPlaying(true);
          }
        }
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  };

  const handleMuteToggle = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // Auto-play when unmuting
      if (!newMutedState && !isPlaying) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    }
  };

  useEffect(() => {
    if (post.type === 'video' && videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [post.type, isMuted]);

  useEffect(() => {
    if (post.type === 'video' && inModal && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Error auto-playing video:", error);
        }
      };
      playVideo();
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [inModal, post.type]);

  if (post.type === 'video') {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={post.media}
          className="absolute inset-0 w-full h-full object-contain"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onClick={(e) => e.stopPropagation()}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className={`p-3 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 z-10
              ${inModal ? 'opacity-0 hover:opacity-100' : 'opacity-100'} transition-opacity`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white translate-x-0.5" />
            )}
          </button>
        </div>
        {inModal && (
          <button
            onClick={handleMuteToggle}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-sm
              hover:bg-black/70 z-10 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        )}
      </div>
    );
  }

  // Image content
  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <img
        src={post.media}
        alt={post.caption}
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
};

const PostModal = ({ post, posts, onClose, onNext, onPrevious, memory }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, onClose]);

  const currentIndex = posts.findIndex(p => p.id === post.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === posts.length - 1;
  const author = memory.authors[post.author];

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {!isFirst && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 md:left-8 z-50 text-white/70 hover:text-white 
            transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {!isLast && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 md:right-8 z-50 text-white/70 hover:text-white 
            transition-colors p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      <div 
        className="max-w-5xl w-full bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full md:w-3/5 bg-black flex-shrink-0">
          <div className="aspect-square w-full h-full">
            <MediaContent post={post} inModal={true} />
          </div>
        </div>

        <div className="w-full md:w-2/5 flex flex-col max-h-[600px] md:max-h-full bg-white">
          <div className="p-4 border-b flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={author.profileImage}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-3 font-semibold">{author.name}</span>
            <button 
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={author.profileImage}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p>
                  <span className="font-semibold">{author.name}</span>
                  {" "}{post.caption}
                </p>
                <p className="text-gray-500 text-xs mt-1">{post.date}</p>
              </div>
            </div>

            {post.comments && post.comments.length > 0 && (
              <div className="mt-6 space-y-4">
                {post.comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={memory.authors[comment.author].profileImage}
                        alt={memory.authors[comment.author].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p>
                        <span className="font-semibold">
                          {memory.authors[comment.author].name}
                        </span>
                        {" "}{comment.text}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{comment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
                <MessageCircle className="w-6 h-6 hover:text-gray-700 cursor-pointer transition-colors" />
                <Send className="w-6 h-6 hover:text-gray-700 cursor-pointer transition-colors" />
              </div>
              <Bookmark className="w-6 h-6 hover:text-gray-700 cursor-pointer transition-colors" />
            </div>
            <div>
              <p className="font-semibold">{post.likes} j'aime</p>
            </div>
          </div>

          <div className="px-4 py-2 text-sm text-gray-500 text-center border-t">
            {currentIndex + 1} sur {posts.length}
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryView = ({ memory, onBack }) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const posts = memory.posts || [];

  const handleNext = () => {
    if (!selectedPost) return;
    const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
    if (currentIndex < posts.length - 1) {
      setSelectedPost(posts[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (!selectedPost) return;
    const currentIndex = posts.findIndex(p => p.id === selectedPost.id);
    if (currentIndex > 0) {
      setSelectedPost(posts[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-white flex flex-col">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-16 flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-purple-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-purple-900">{memory.title}</h1>
              <p className="text-sm text-purple-600">{posts.length} publications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-4">
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="relative aspect-square w-full overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <MediaContent post={post} />

                {post.type === 'video' && (
                  <div className="absolute top-2 right-2 p-1 bg-black/50 rounded-md z-10">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 
                  backdrop-blur-sm rounded-full px-2 py-1 z-10">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img 
                      src={memory.authors[post.author].profileImage}
                      alt={memory.authors[post.author].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-white text-sm">
                    {memory.authors[post.author].name}
                  </span>
                </div>

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200 flex items-center justify-center gap-8">
                  <div className="flex items-center text-white">
                    <Heart className="w-6 h-6 fill-white" />
                    <span className="ml-2">{post.likes}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <MessageCircle className="w-6 h-6 fill-white" />
                    <span className="ml-2">{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          posts={posts}
          memory={memory}
          onClose={() => setSelectedPost(null)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3E8FF;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #A78BFA;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8B5CF6;
        }
      `}</style>
    </div>
  );
};

export default GalleryView;