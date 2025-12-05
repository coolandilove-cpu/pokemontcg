"use client";

import { useEffect, useRef, useState } from "react";

interface PackOpeningSoundsConfig {
  enabled?: boolean;
  volume?: number;
}

/**
 * Hook để quản lý sound effects khi mở pack
 * Sử dụng Web Audio API để tạo synthetic sounds nếu không có file audio
 */
export function usePackOpeningSounds(config: PackOpeningSoundsConfig = {}) {
  const { enabled = true, volume = 0.5 } = config;
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Initialize AudioContext (lazy initialization on first use)
  const getAudioContext = () => {
    if (!audioContextRef.current && typeof window !== "undefined" && "AudioContext" in window) {
      try {
        audioContextRef.current = new AudioContext();
        // Resume context if suspended (Safari requires user interaction)
        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume().catch(() => {
            console.warn("AudioContext resume failed - user interaction may be required");
          });
        }
      } catch (error) {
        console.warn("Failed to create AudioContext:", error);
      }
    }
    return audioContextRef.current;
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Play sound from file (if available)
  const playSoundFile = (src: string, volume: number = 0.5) => {
    if (!isEnabled || typeof window === "undefined") return;

    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch((error) => {
        console.warn("Failed to play sound:", error);
      });
      return audio;
    } catch (error) {
      console.warn("Error playing sound file:", error);
    }
  };

  // Generate synthetic sound using Web Audio API
  const playSyntheticSound = (
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.3
  ) => {
    if (!isEnabled) return;

    const audioContext = getAudioContext();
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn("Error playing synthetic sound:", error);
    }
  };

  // Sound effects for pack opening
  const sounds = {
    // Sound khi bắt đầu scroll (shuffle cards)
    startScroll: () => {
      // Try to play file first, fallback to synthetic
      const audio = playSoundFile("/sounds/pack-shuffle.mp3", volume);
      if (!audio) {
        // Synthetic shuffle sound (multiple quick tones)
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            playSyntheticSound(200 + i * 50, 0.1, "sine", volume * 0.3);
          }, i * 50);
        }
      }
    },

    // Sound khi đang scroll (loop)
    scrollLoop: () => {
      const audio = playSoundFile("/sounds/pack-scroll.mp3", volume * 0.4);
      if (!audio) {
        // Synthetic scroll sound (low frequency rumble)
        playSyntheticSound(80, 0.2, "sawtooth", volume * 0.2);
      }
    },

    // Sound khi reveal card (common/uncommon)
    revealCard: () => {
      const audio = playSoundFile("/sounds/card-reveal.mp3", volume);
      if (!audio) {
        // Synthetic reveal sound (ascending tone)
        playSyntheticSound(300, 0.3, "sine", volume);
        setTimeout(() => {
          playSyntheticSound(400, 0.2, "sine", volume * 0.8);
        }, 100);
      }
    },

    // Sound khi reveal rare card
    revealRareCard: () => {
      const audio = playSoundFile("/sounds/card-reveal-rare.mp3", volume);
      if (!audio) {
        // Synthetic rare reveal sound (chord progression)
        playSyntheticSound(400, 0.2, "sine", volume);
        setTimeout(() => {
          playSyntheticSound(500, 0.2, "sine", volume * 0.9);
        }, 100);
        setTimeout(() => {
          playSyntheticSound(600, 0.3, "sine", volume);
        }, 200);
      }
    },

    // Sound khi reveal ultra rare card
    revealUltraRareCard: () => {
      const audio = playSoundFile("/sounds/card-reveal-ultra-rare.mp3", volume);
      if (!audio) {
        // Synthetic ultra rare reveal sound (epic chord)
        playSyntheticSound(300, 0.1, "sine", volume);
        setTimeout(() => {
          playSyntheticSound(400, 0.1, "sine", volume);
        }, 50);
        setTimeout(() => {
          playSyntheticSound(500, 0.1, "sine", volume);
        }, 100);
        setTimeout(() => {
          playSyntheticSound(600, 0.4, "sine", volume);
        }, 150);
        setTimeout(() => {
          playSyntheticSound(700, 0.3, "sine", volume * 0.9);
        }, 300);
      }
    },

    // Sound khi complete (success)
    complete: () => {
      const audio = playSoundFile("/sounds/pack-complete.mp3", volume);
      if (!audio) {
        // Synthetic success sound (ascending major chord)
        playSyntheticSound(400, 0.2, "sine", volume);
        setTimeout(() => {
          playSyntheticSound(500, 0.2, "sine", volume * 0.9);
        }, 100);
        setTimeout(() => {
          playSyntheticSound(600, 0.3, "sine", volume);
        }, 200);
      }
    },

    // Sound khi click button
    click: () => {
      const audio = playSoundFile("/sounds/click.mp3", volume * 0.3);
      if (!audio) {
        playSyntheticSound(800, 0.1, "sine", volume * 0.2);
      }
    },
  };

  return {
    sounds,
    isEnabled,
    setIsEnabled,
    toggle: () => setIsEnabled(!isEnabled),
  };
}

