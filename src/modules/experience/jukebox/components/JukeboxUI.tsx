import { useAtom } from "jotai";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  jukeboxModeAtom,
  jukeboxStateAtom,
  currentSongAtom,
} from "../state/jukebox";
import { createPortal } from "react-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useSocket } from "../../multiplayer/context/SocketProvider";

// Define search result type
type SearchResult = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  channel: string;
  artist?: string;
  url?: string;
};

// Define queue item type
type QueueItem = {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  artist?: string;
  addedBy: string;
  filePath: string;
};

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "";

export function JukeboxUI() {
  const [, setJukeboxMode] = useAtom(jukeboxModeAtom);
  const [jukeboxState, setJukeboxState] = useAtom(jukeboxStateAtom);
  const [currentSong] = useAtom(currentSongAtom);
  const [volume, setVolume] = useState(0.2);

  // UI state
  const [view, setView] = useState<"main" | "search" | "url">("main");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { socket } = useSocket();
  const { profile } = useAuth();
  const urlInputRef = useRef<HTMLInputElement>(null);

  // In JukeboxUI.tsx
  useEffect(() => {
    if (socket) {
      // Listen for volume changes from the server
      const handleVolumeChange = (data: { volume: number }) => {
        setVolume(data.volume);
      };

      socket.on("jukebox:volumeChange", handleVolumeChange);

      // Request the current volume when the component mounts
      socket.emit("jukebox:getVolume");

      return () => {
        socket.off("jukebox:volumeChange", handleVolumeChange);
      };
    }
  }, [socket]);

  // Get current queue and song info when UI opens
  useEffect(() => {
    if (socket) {
      // Listen for jukebox state updates
      const handleStateUpdate = (data: {
        currentSong?: any;
        state?: "idle" | "processing" | "playing";
        queue?: QueueItem[];
      }) => {
        if (data.currentSong) {
          // This is handled by the currentSongAtom
          console.log("Current song updated:", data.currentSong);
        }

        if (data.state) {
          setJukeboxState(data.state);
        }

        if (data.queue) {
          setQueue(data.queue);
        }
      };

      // Listen for queue updates
      const handleQueueUpdate = (queueData: QueueItem[]) => {
        setQueue(queueData);
      };

      // Listen for processing state updates
      const handleProcessingUpdate = (isProcessing: boolean) => {
        setJukeboxState(isProcessing ? "processing" : "idle");
      };

      socket.on("jukebox:stateUpdate", handleStateUpdate);
      socket.on("jukebox:queueUpdate", handleQueueUpdate);
      socket.on("jukebox:processing", handleProcessingUpdate);

      // Request current jukebox state when component mounts, but only if we don't have queue data
      if (queue.length === 0) {
        socket.emit("jukebox:getState");
      }

      return () => {
        socket.off("jukebox:stateUpdate", handleStateUpdate);
        socket.off("jukebox:queueUpdate", handleQueueUpdate);
        socket.off("jukebox:processing", handleProcessingUpdate);
      };
    }
  }, [socket, setJukeboxState, queue.length]);

  // Focus URL input when switching to URL view
  useEffect(() => {
    if (view === "url" && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [view]);

  // Exit jukebox mode
  const handleClose = () => {
    setJukeboxMode("inactive");
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim() || !socket) return;

    setIsSearching(true);
    setHasSearched(true);

    // Send the search query directly as a string, not an object
    socket.emit("jukebox:search", searchQuery, (response: any) => {
      setIsSearching(false);

      if (response.success) {
        setSearchResults(response.results);
      } else {
        // Show error message
        console.error("Search error:", response.error);
      }
    });
  };

  // Handle song selection from search results
  const handleSelectSong = (song: SearchResult) => {
    if (!socket || !profile) return;

    setJukeboxState("processing");
    socket.emit(
      "jukebox:addSong",
      {
        id: song.id,
        addedBy: profile.username,
      },
      (response: any) => {
        if (response.success) {
          // Reset search view
          setView("main");
          setSearchQuery("");
          setSearchResults([]);
        } else {
          console.error("Error adding song:", response.error);
        }
      }
    );
  };

  // Handle custom URL submission
  const handleUrlSubmit = () => {
    if (!customUrl.trim() || !socket || !profile) return;

    setJukeboxState("processing");
    socket.emit(
      "jukebox:addSong",
      {
        url: customUrl,
        addedBy: profile.username,
      },
      (response: any) => {
        if (response.success) {
          // Reset URL view
          setView("main");
          setCustomUrl("");
        } else {
          console.error("Error adding song by URL:", response.error);
        }
      }
    );
  };

  // Handle volume change (local only)
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    // Emit volume change to update the audio player
    if (socket) {
      socket.emit("jukebox:setVolume", { volume: newVolume });
    }
  };

  const handleDownload = useCallback((song: QueueItem) => {
    if (!song || !song.filePath) return;

    const url = `${SERVER_URL}${song.filePath}`;
    const fileName = `${song.title}.mp3`;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => console.error("Error downloading file:", error));
  }, []);

  // Processing overlay (only shown when processing)
  const renderProcessingOverlay = () => {
    if (jukeboxState !== "processing") return null;

    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black/80 p-6 rounded-lg border border-white/20 max-w-md text-white text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-white/90 mb-2">
            Procesando tu solicitud...
          </p>
          <p className="text-white/70">
            Estamos preparando tu canción. Puedes esperar o salir del modo
            Rocola.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    );
  };

  // Now Playing Bar (bottom of screen)
  // Now Playing Bar (bottom of screen)
  const renderNowPlayingBar = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/70 backdrop-blur-md border-t border-white/10 p-3 flex items-center z-40">
        {/* Now Playing Info */}
        <div className="flex items-center flex-1 min-w-0">
          {currentSong ? (
            <>
              <div className="relative group">
                <img
                  src={currentSong.thumbnail}
                  alt={currentSong.title}
                  className="w-14 h-14 object-cover rounded-md mr-4"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                  <span className="text-xs text-white">Reproduciendo</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white truncate">
                  {currentSong.title}
                </div>
                <div className="text-xs text-white/60 flex items-center">
                  <span className="mr-2">
                    Añadida por: {currentSong.addedBy}
                  </span>

                  {/* Download button */}
                  {currentSong && currentSong.filePath && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDownload(currentSong);
                      }}
                      className="text-blue-400 hover:text-blue-300 flex items-center transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Descargar</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center">
              <div className="w-14 h-14 bg-white/10 rounded-md mr-4 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white/40"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-white">Música de fondo</div>
                <div className="text-xs text-white/60">Rocola en espera</div>
              </div>
            </div>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-48 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white/70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314"
            />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="ml-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  // Queue Panel (right side)
  const renderQueuePanel = () => {
    if (view !== "main") return null;

    return (
      <div className="fixed top-20 right-5 bottom-24 w-80 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden z-40">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">
            Cola de reproducción
          </h3>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {queue.length > 0 ? (
            <div className="space-y-3">
              {queue.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-6 h-6 flex items-center justify-center text-white/50 mr-2 bg-white/10 rounded-full text-sm">
                    {index + 1}
                  </div>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-md mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-white/60 flex justify-between mt-1">
                      <span>{item.addedBy}</span>
                      <span>{item.duration}</span>
                      {item.filePath && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item);
                          }}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <p className="text-white/60 text-sm">No hay canciones en cola</p>
              <p className="text-white/40 text-xs mt-2">
                Añade canciones usando los botones de abajo
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Action Buttons (left side)
  const renderActionButtons = () => {
    if (view !== "main") return null;

    return (
      <div className="fixed top-20 left-5 w-64 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden z-40">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-medium text-white">Rocola</h3>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={() => setView("search")}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar canción
          </button>

          <button
            onClick={() => setView("url")}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white rounded-md transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
              />
            </svg>
            Añadir por URL
          </button>
        </div>
      </div>
    );
  };

  // Search Panel (center)
  const renderSearchPanel = () => {
    if (view !== "search") return null;

    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] bg-black/80 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden z-40">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Buscar canciones</h3>
          <button
            onClick={() => setView("main")}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (hasSearched) setHasSearched(false);
                }}
                placeholder="Buscar canciones en YouTube..."
                className="w-full bg-white/5 text-white p-3 pl-10 rounded-md border border-white/10 text-sm focus:outline-none focus:border-white/30"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className={`px-6 py-3 rounded-md ${
                isSearching || !searchQuery.trim()
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              } text-white transition-colors`}
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Buscar"
              )}
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-white/70">Buscando canciones...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelectSong(result)}
                    className="flex items-center p-3 rounded-md bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <img
                      src={result.thumbnail}
                      alt={result.title}
                      className="w-20 h-16 object-cover rounded-md mr-4"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {result.title}
                      </div>
                      <div className="text-sm text-white/70 flex items-center justify-between mt-1">
                        <span>
                          {result.channel || result.artist || "Unknown"}
                        </span>
                        <span className="bg-black/30 px-2 py-1 rounded-full text-xs">
                          {result.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery &&
              !isSearching &&
              hasSearched &&
              searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/20 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-white/70 text-lg mb-1">
                  No se encontraron resultados
                </p>
                <p className="text-white/50 text-sm">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-white/20 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-white/70">
                  Usa el campo de arriba para buscar canciones
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // URL Input Panel
  const renderUrlPanel = () => {
    if (view !== "url") return null;

    return (
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] bg-black/80 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden z-40">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Añadir por URL</h3>
          <button
            onClick={() => setView("main")}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white/5 p-4 rounded-md border border-white/10">
            <p className="text-white/80 text-sm mb-2">
              Introduce la URL de una canción de YouTube, Soundcloud o cualquier
              otra plataforma compatible:
            </p>
            <div className="relative">
              <input
                ref={urlInputRef}
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-black/40 text-white p-3 pl-10 rounded-md border border-white/20 text-sm focus:outline-none focus:border-white/50"
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                />
              </svg>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setView("main")}
              className="flex-1 py-3 px-4 bg-transparent border border-white/30 text-white rounded-md hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUrlSubmit}
              disabled={!customUrl.trim()}
              className={`flex-1 py-3 px-4 ${
                !customUrl.trim()
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              } text-white rounded-md transition-colors`}
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Use createPortal to render this UI outside the Canvas
  return createPortal(
    <>
      {/* Now Playing Bar (always visible) */}
      {renderNowPlayingBar()}

      {/* Queue Panel (right side) */}
      {renderQueuePanel()}

      {/* Action Buttons (left side) */}
      {renderActionButtons()}

      {/* Search Panel (center, conditional) */}
      {renderSearchPanel()}

      {/* URL Input Panel (center, conditional) */}
      {renderUrlPanel()}

      {/* Processing Overlay (full screen, conditional) */}
      {renderProcessingOverlay()}
    </>,
    document.body
  );
}
