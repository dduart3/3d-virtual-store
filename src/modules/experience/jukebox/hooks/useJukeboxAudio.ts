import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { currentSongAtom } from "../state/jukebox";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSocket } from "../../multiplayer/context/SocketProvider";

// Global audio instance to prevent duplicates across component remounts
let globalAudioInstance: HTMLAudioElement | null = null;

// Constants
const JUKEBOX_POSITION = new THREE.Vector3(-157.5, 0.5, -51.9);
const MAX_DISTANCE = 50; // Maximum distance at which audio can be heard
const MIN_DISTANCE = 1; // Distance at which audio is at full volume
const OUTSIDE_VOLUME_FACTOR = 0.2;
const DEFAULT_SONG_URL = "/music/default.mp3";

// Store boundaries
const STORE_BOUNDS = {
  minX: -161,
  maxX: -130,
  minZ: -70,
  maxZ: -40,
};

// Check if avatar is inside the store
const isInsideStore = (position: THREE.Vector3): boolean => {
  return (
    position.x >= STORE_BOUNDS.minX &&
    position.x <= STORE_BOUNDS.maxX &&
    position.z >= STORE_BOUNDS.minZ &&
    position.z <= STORE_BOUNDS.maxZ
  );
};

export interface JukeboxAudioOptions {
  enabled?: boolean;
  avatarPosition?: THREE.Vector3;
}

export function useJukeboxAudio(options: JukeboxAudioOptions = {}) {
  const { enabled = true, avatarPosition = new THREE.Vector3() } = options;
  const [, setCurrentSong] = useAtom(currentSongAtom);

  // Use refs for all state that shouldn't trigger re-renders
  const audioInitializedRef = useRef(false);
  const initialStateRequestedRef = useRef(false);
  const baseVolumeRef = useRef(0.8);
  const currentSrcRef = useRef("");
  const isPlayingCustomSongRef = useRef(false);
  const serverTimeOffsetRef = useRef(0); // To track time difference between server and client

  const { socket } = useSocket();
  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || "";

  // Set up audio - ONLY ONCE
  useEffect(() => {
    if (!enabled) return;

    // Create audio element only if it doesn't exist globally yet
    if (!globalAudioInstance) {
      console.log("Creating new global audio element");
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = DEFAULT_SONG_URL;
      currentSrcRef.current = DEFAULT_SONG_URL;
      audio.loop = true;
      audio.volume = 0;
      audio.load();
      globalAudioInstance = audio;

      // Set up event listeners
      audio.addEventListener("play", () =>
        console.log("Audio started playing")
      );
      audio.addEventListener("pause", () => console.log("Audio paused"));
      audio.addEventListener("error", (e) => console.error("Audio error:", e));

      // We don't need to handle ended event anymore as the server is authoritative
      // But we'll keep it for logging
      audio.addEventListener("ended", () => {
        console.log("Song ended event fired on client");
      });
    }

    // Initialize audio on user interaction
    const initializeAudio = () => {
      if (!audioInitializedRef.current && globalAudioInstance) {
        console.log("Initializing audio after user interaction");

        globalAudioInstance
          .play()
          .then(() => {
            console.log("Audio initialized successfully");
            audioInitializedRef.current = true;

            // Request sync after audio is initialized
            if (socket && isPlayingCustomSongRef.current) {
              socket.emit("jukebox:sync");
            }
          })
          .catch((err) => console.error("Error initializing audio:", err));
      }
    };

    // Add event listeners for user interaction
    document.addEventListener("click", initializeAudio);
    document.addEventListener("keydown", initializeAudio);

    return () => {
      document.removeEventListener("click", initializeAudio);
      document.removeEventListener("keydown", initializeAudio);
      
      if (!enabled && globalAudioInstance) {
        globalAudioInstance.pause();
      }
    };
  }, [enabled, socket]);

  // Update audio volume based on distance - only when enabled
  useFrame(() => {
    if (!globalAudioInstance || !audioInitializedRef.current || !enabled) return;

    // Calculate distance between avatar and jukebox
    const distance = avatarPosition.distanceTo(JUKEBOX_POSITION);

    // Calculate volume based on distance
    let calculatedVolume = 0;

    if (distance <= MIN_DISTANCE) {
      calculatedVolume = baseVolumeRef.current;
    } else if (distance >= MAX_DISTANCE) {
      calculatedVolume = 0;
    } else {
      const falloff =
        1 - (distance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE);
      calculatedVolume = baseVolumeRef.current * falloff;
    }

    // Apply additional reduction if outside the store
    if (!isInsideStore(avatarPosition)) {
      calculatedVolume *= OUTSIDE_VOLUME_FACTOR;
    }

    // Apply volume with smooth transition
    if (globalAudioInstance.volume !== calculatedVolume) {
      globalAudioInstance.volume = THREE.MathUtils.lerp(
        globalAudioInstance.volume,
        calculatedVolume,
        0.1
      );
    }
  });

  // Listen for jukebox updates from server - ONLY ONCE for socket setup
  useEffect(() => {
    if (!socket || !enabled) return;

    // Handle now playing updates
    const handleNowPlaying = (songData: any | null) => {
      if (!globalAudioInstance) return;

      if (songData && songData.filePath) {
        // Update the current song atom
        setCurrentSong(songData);

        // Only change the audio source if it's different
        const newSrc = `${SERVER_URL}${songData.filePath}`;
        if (currentSrcRef.current !== newSrc) {
          console.log("Changing audio source to:", newSrc);
          globalAudioInstance.src = newSrc;
          currentSrcRef.current = newSrc;
          globalAudioInstance.loop = false;
          isPlayingCustomSongRef.current = true; // Mark as playing custom song
          globalAudioInstance.load();

          if (audioInitializedRef.current) {
            globalAudioInstance
              .play()
              .then(() => {
                console.log("Song started playing");

                // If the song has a startTime, sync to it
                if (songData.startTime && globalAudioInstance) {
                  const serverTime = songData.startTime;
                  const clientTime = Date.now();
                  serverTimeOffsetRef.current = serverTime - clientTime;

                  // Calculate elapsed time
                  const elapsedMs = clientTime - serverTime;
                  if (elapsedMs > 0 && elapsedMs < 30000) {
                    // Only seek if reasonable (< 30s)
                    console.log(`Seeking to ${elapsedMs}ms into the song`);
                    globalAudioInstance.currentTime = elapsedMs / 1000;
                  }
                }
              })
              .catch((err) => console.error("Error playing song:", err));
          }
        }
      } else if (!songData && currentSrcRef.current !== DEFAULT_SONG_URL) {
        // No song playing, go back to default music
        setCurrentSong(null);
        console.log("Changing to default background music");
        globalAudioInstance.src = DEFAULT_SONG_URL;
        currentSrcRef.current = DEFAULT_SONG_URL;
        globalAudioInstance.loop = true;
        isPlayingCustomSongRef.current = false; // Mark as playing default song
        globalAudioInstance.load();

        if (audioInitializedRef.current) {
          globalAudioInstance
            .play()
            .then(() => console.log("Background music started playing"))
            .catch((err) =>
              console.error("Error playing background music:", err)
            );
        }
      }
    };

    // Handle sync response for clients joining mid-song
    const handleSync = (data: any) => {
      if (!globalAudioInstance || !audioInitializedRef.current) return;

      console.log("Received sync data:", data);

      if (data.song && data.song.filePath) {
        // Update the current song atom
        setCurrentSong(data.song);

        // Set the audio source
        const newSrc = `${SERVER_URL}${data.song.filePath}`;
        globalAudioInstance.src = newSrc;
        currentSrcRef.current = newSrc;
        globalAudioInstance.loop = false;
        isPlayingCustomSongRef.current = true;
        globalAudioInstance.load();

        // Calculate server-client time offset
        const serverTime = data.serverTime;
        const clientTime = Date.now();
        serverTimeOffsetRef.current = serverTime - clientTime;

        // Play and seek to the correct position
        globalAudioInstance
          .play()
          .then(() => {
            if (data.elapsedTime > 0 && globalAudioInstance) {
              console.log(
                `Syncing: Seeking to ${data.elapsedTime}ms into the song`
              );
              globalAudioInstance.currentTime = data.elapsedTime / 1000;
            }
          })
          .catch((err) => console.error("Error during sync playback:", err));
      }
    };

    // Handle volume change
    const handleVolumeChange = (data: { volume: number }) => {
      baseVolumeRef.current = data.volume;
    };

    socket.on("jukebox:nowPlaying", handleNowPlaying);
    socket.on("jukebox:volumeChange", handleVolumeChange);
    socket.on("jukebox:sync", handleSync);

    // Request current jukebox state only once
    if (!initialStateRequestedRef.current) {
      console.log("Requesting initial jukebox state");
      socket.emit("jukebox:getState");
      initialStateRequestedRef.current = true;
    }

    return () => {
      socket.off("jukebox:nowPlaying", handleNowPlaying);
      socket.off("jukebox:volumeChange", handleVolumeChange);
      socket.off("jukebox:sync", handleSync);
    };
  }, [socket, setCurrentSong, enabled]);

  // Return methods to control the audio
  return {
    play: () => {
      if (globalAudioInstance && audioInitializedRef.current) {
        globalAudioInstance.play();
      }
    },
    pause: () => {
      if (globalAudioInstance) {
        globalAudioInstance.pause();
      }
    },
    setVolume: (volume: number) => {
      baseVolumeRef.current = Math.max(0, Math.min(1, volume));
    },
    getAudioInstance: () => globalAudioInstance,
    isInitialized: () => audioInitializedRef.current,
  };
}
