import React, { createContext, useContext, useState, useEffect } from "react";

// Create context without default value initially
const SoundContext = createContext(null);

export const SoundProvider = ({ children }) => {
  const [sounds, setSounds] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Define sounds directly in the context
        const soundConfig = {
          click: "/sound/click.mp3",
          deploy: "/sound/deploy.mp3",
          abort: "/sound/abort.mp3",
          success: "/sound/success.mp3",
          warning: "/sound/warning.mp3",
          typing: "/sound/typing.mp3",
        };

        const loadedSounds = {};

        for (const [soundName, soundPath] of Object.entries(soundConfig)) {
          try {
            const audio = new Audio(soundPath);
            audio.volume = 0.5;
            audio.preload = "auto";

            // Add event listeners to track loading
            audio.addEventListener("canplaythrough", () => {
              // Sound is ready to play
            });

            audio.addEventListener("error", (e) => {
              console.error(`❌ Error loading sound ${soundName}:`, e);
            });

            loadedSounds[soundName] = audio;
          } catch (error) {
            console.warn(`Failed to load sound: ${soundName}`, error);
          }
        }

        setSounds(loadedSounds);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to initialize sounds:", error);
        setIsLoaded(true); // Still mark as loaded so app doesn't hang
      }
    };

    loadSounds();
  }, []);

  const playSound = (soundType) => {
    try {
      if (sounds[soundType]) {
        sounds[soundType].currentTime = 0;
        sounds[soundType].play().catch((error) => {
          // Sound play prevented by browser (user interaction required)
        });
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}`, error);
    }
  };

  const contextValue = {
    playSound,
    sounds,
    isLoaded,
  };

  return <SoundContext.Provider value={contextValue}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  const context = useContext(SoundContext);

  // If no context (not wrapped in provider), return default
  if (!context) {
    return {
      playSound: () => {}, // Silent fallback
      sounds: {},
      isLoaded: false,
    };
  }

  return context;
};

// Higher-order component to add sound to any clickable element
export const withSound = (Component, soundType = "click") => {
  return React.forwardRef((props, ref) => {
    const { playSound } = useSound();

    const handleClick = (e) => {
      playSound(soundType);
      if (props.onClick) {
        props.onClick(e);
      }
    };

    return <Component {...props} ref={ref} onClick={handleClick} />;
  });
};

export default SoundContext;
