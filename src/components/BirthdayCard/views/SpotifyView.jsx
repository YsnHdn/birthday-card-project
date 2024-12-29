// SpotifyView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Clock, List, Check, X, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react';

// Composant guide initial
const InitialGuide = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] animate-fade-in">
    <div className="relative max-w-md bg-purple-900 p-8 rounded-lg text-center space-y-6">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-2xl text-white font-bold">Hello Mery 💜</div>

      <p className="text-purple-200">
        Lmhm , hadou machi aghani 😂😂😂, mais des poèmes kunt ktebthom elik ch7al hada. I hope tchoufihom kamline.
        Soit cliquer ela Lbouton Lkhder , sinon chose whatever you want ...
      </p>

      <div className="flex justify-center">
        <div className="animate-bounce bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
          <Play className="w-6 h-6 text-white translate-x-0.5" />
        </div>
      </div>

      <button
        onClick={onClose}
        className="px-6 py-2 bg-white text-purple-900 rounded-full font-medium hover:bg-purple-100 transition-colors"
      >
        Will do 💫🤗
      </button>
    </div>
  </div>
);

// Composant pour l'affichage des paroles

const LyricsDisplay = ({ lyrics }) => (
  <div className="flex-1 overflow-y-auto custom-scrollbar">
    <div className="max-w-2xl mx-auto">
      <div className="space-y-12">
        {lyrics.map((stanza, index) => (
          <div key={index}>
            <p className="text-2xl text-purple-300/80 italic mb-4">
              {stanza.fr}
            </p>
            <p className="text-lg text-purple-400/60 italic">
              {stanza.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NowPlayingOverlay = ({
  song,
  onClose,
  onPrevious,
  onNext,
  progress,
  isPlaying,
  onPlayPause
}) => {
  return (
    <div className="fixed inset-0 z-50">
      {/* Fond avec gradient et motif */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-600/30 to-purple-900/50">
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, purple 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative h-full flex flex-col p-8">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {/* En-tête */}
        <div className="text-center mb-8">
          <h2 className="text-purple-300 text-xl font-light">Now Playing</h2>
          <h1 className="text-white text-5xl font-bold mt-2 mb-4">{song.title}</h1>
          <p className="text-purple-200 text-2xl">{song.artist}</p>
        </div>

        {/* Zone de paroles avec hauteur limitée */}
        <div className="flex-1 min-h-0 mb-8 overflow-y-auto custom-scrollbar">
          <LyricsDisplay lyrics={song.lyrics} />
        </div>

        {/* Contrôles */}
        <div className="relative">
          {/* Barre de progression */}
          <div className="w-full max-w-3xl mx-auto mb-4">
            <div className="w-full h-1 bg-white/20 rounded-full">
              <div
                className="h-full bg-purple-400 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Temps */}
          <div className="w-full max-w-3xl mx-auto text-white/70 text-sm flex justify-between mb-4">
            <span>{Math.floor(progress * 0.15)} secondes</span>
            <span>15 secondes</span>
          </div>

          {/* Boutons de contrôle */}
          <div className="w-full max-w-3xl mx-auto flex items-center justify-between text-white/70">
            <div className="flex items-center gap-8">
              <button
                onClick={onPrevious}
                className="p-2 hover:text-white"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={onPlayPause}
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transform transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-black" />
                ) : (
                  <Play className="w-5 h-5 text-black translate-x-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 hover:text-white"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5" />
              <div className="w-24 h-1 bg-white/20 rounded-full">
                <div className="w-2/3 h-full bg-white rounded-full" />
              </div>
              <Maximize2 className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
      `}</style>
    </div>
  );
};

// Composant principal

const SpotifyView = ({ memory, onBack }) => {
  const [showGuide, setShowGuide] = useState(true);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef(null);

  const playlist = [
    {
      id: 1,
      title: "مَرْيَمِي",
      artist: "Yassine Handane",
      album: "مَرْيَمِي",
      dateAdded: "18 août 2024",
      duration: "1:46",
      lyrics: [
        {

          en: "مريم، يا نور العيون , كلماتك تحيي الجفون"
        },
        {
          en: "بعدك يشعل الشجون , لكن حبك في القلب مصون"
        },
        {
          en: "في كل يوم أراك , كالقمر في سماك"
        },
        {
          en: "💜 روحك تنير دربي , وقلبي يهمس"
        },
      ]
    },
    {
      id: 2,
      title: "قمري البنفسجي",
      artist: "Yassine Handane",
      album: "مَرْيَمِي",
      dateAdded: "15 août 2024",
      duration: "2:41",
      lyrics: [
        {
          en: "مريم، يا قمري البنفسجي , تضيئين ليلي في كل حين"
        },
        {
          en: "خجلك مثل النجوم الخافتة , وروحك أجمل ما في الكون"
        },
        {
          en: "في صمتك سحر يأسر قلبي , وفي كلماتك دفء وحنين"
        },
        {
          en: "أنت السر في كل جمال , وأنت الحب الذي به أستكين"
        }
      ]
    },
    {
      id: 3,
      title: "حروف الجواهر",
      artist: "Yassine Handane",
      album: "مَرْيَمِي",
      dateAdded: "15 août 2024",
      duration: "2:41",
      lyrics: [
        {
          en: "💜💜 مريم"
        },
        {
          en: "كل حرف من اسمك يحكي قصة حبنا"
        },
        {
          en: "م - محبة بلا حدود 💜💜"
        },
        {
          en: "ر - روح تسكن روحي ✨"
        },
        {
          en: "ي - يقين بأنك الأجمل 🌕🌸"
        },
        {
          en: "م - معك أرى المستحيل ممكنا 🙌🏻"
        },
        {
          en: "مريم، يا روح من نور 👑"
        },
        {
          en: "جمالك يفوق الوصف والسطور ✨🌕"
        },
        {
          en: "قلبك الطيب كنز ثمين 🌟"
        },
        {
          en: "وحنانك يداوي كل الأمور 🥰"
        }
      ]
    },
    {
      id: 4,
      title: "Lettres à Ma Douce",
      artist: "Yassine Handane",
      album: "Clair de Mery",
      dateAdded: "15 août 2024",
      duration: "2:41",
      lyrics: [
        {
          en: "Ma douce Mery, mon cœur paisible"
        },
        {
          en: "Comme la lune dans la nuit invisible"
        },
        {
          en: "Tu illumines mes jours simplement"
        },
        {
          en: "Avec ton âme, si doucement"
        },
        {
          en: "Chaque moment devient précieux"
        },
        {
          en: "Quand tu le touches de tes yeux"
        },
        {
          en: "Mon cœur ne cesse de répéter:"
        },
        {
          en: "Tu es mon plus beau destiné 💜"
        },
      ]
    },
    {
      id: 5,
      title: "Douceur Violette",
      artist: "Yassine Handane",
      album: "Clair de Mery",
      dateAdded: "15 août 2024",
      duration: "2:41",
      lyrics: [
        {
          en: "Ma douce Mery, étoile du soir"
        },
        {
          en: "Dans mes pensées, un rayon d'espoir"
        },
        {
          en: "Comme la lune caresse la nuit"
        },
        {
          en: "Ton âme pure me remplit de vie"
        },
        {
          en: "Chaque moment devient une danse"
        },
        {
          en: "Entre nos cœurs malgré la distance"
        },
        {
          en: "Tu transformes les heures ordinaires"
        },
        {
          en: "En instants précieux et singuliers"
        },
        {
          en: "Dans ce monde de violet et d'or"
        },
        {
          en: "Où ta présence est mon trésor"
        },
        {
          en: "Tu es ma lune, mon destin"
        },
        {
          en: "Mon plus beau poème sans fin 💜"
        },
      ]
    },
  ];

  const startPlayback = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          const currentIndex = playlist.findIndex(s => s.id === song.id);
          const nextSong = playlist[(currentIndex + 1) % playlist.length];
          startPlayback(nextSong);
          return 0;
        }
        return prev + (100 / 150); // 100% sur 15 secondes
      });
    }, 100);
  };

  const handleSongClick = (song) => {
    startPlayback(song);
  };

  const handleMainPlay = () => {
    if (!isPlaying) {
      startPlayback(playlist[0]);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const previousSong = playlist[(currentIndex - 1 + playlist.length) % playlist.length];
    startPlayback(previousSong);
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextSong = playlist[(currentIndex + 1) % playlist.length];
    startPlayback(nextSong);
  };

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 to-gray-900 text-white flex flex-col">
      {showGuide && (
        <InitialGuide onClose={() => setShowGuide(false)} />
      )}

      {/* Header */}
      <div className="p-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Zone scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* En-tête playlist */}
        <div className="p-8 pt-0">
          <div className="flex items-end gap-6">
            <div className="w-48 h-48 flex-shrink-0 shadow-2xl">
              <img
                src={memory.image || "/api/placeholder/400/400"}
                alt="Playlist cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm">Playlist</span>
              <h1 className="text-7xl font-bold mb-4">M.Y</h1>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="font-semibold">Meriem Ouâddi .   Yassine Handane </span>
                <span>• 2 sauvegardes • 327 titres, environ 23 h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="px-8 py-4 flex items-center gap-4 sticky top-0 bg-gradient-to-b from-purple-900/95 to-purple-900/80 backdrop-blur-sm z-10">
          <button
            className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            onClick={handleMainPlay}
          >
            {isPlaying ?
              <Pause className="w-6 h-6" /> :
              <Play className="w-6 h-6 translate-x-0.5" />}
          </button>
          <Check className="w-8 h-8 text-green-500" />
          <button className="text-gray-400 hover:text-white">
            <List className="w-8 h-8" />
          </button>
        </div>

        {/* Liste des chansons */}
        <div className="px-8 pb-24">
          <table className="w-full text-gray-400 text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="py-2 text-left w-12">#</th>
                <th className="py-2 text-left">Titre</th>
                <th className="py-2 text-left">Album</th>
                <th className="py-2 text-left">Date d'ajout</th>
                <th className="py-2 text-right pr-4">
                  <Clock className="w-4 h-4 inline-block" />
                </th>
              </tr>
            </thead>
            <tbody>
              {playlist.map((song) => (
                <tr
                  key={song.id}
                  className="hover:bg-white/10 group cursor-pointer"
                  onClick={() => handleSongClick(song)}
                >
                  <td className="py-3">
                    <span className="group-hover:hidden">{song.id}</span>
                    <Play className="w-4 h-4 hidden group-hover:block" />
                  </td>
                  <td>
                    <div>
                      <div className="text-white font-medium">{song.title}</div>
                      <div>{song.artist}</div>
                    </div>
                  </td>
                  <td>{song.album}</td>
                  <td>{song.dateAdded}</td>
                  <td className="text-right pr-4">{song.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {currentSong && (
        <NowPlayingOverlay
          song={currentSong}
          onClose={() => {
            clearInterval(progressInterval.current);
            setCurrentSong(null);
            setIsPlaying(false);
          }}
          onPrevious={handlePrevious}
          onNext={handleNext}
          progress={progress}
          isPlaying={isPlaying}
          onPlayPause={handleMainPlay}
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default SpotifyView;  