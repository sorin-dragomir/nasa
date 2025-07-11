// Direct sound implementation without React Context
class DirectSoundManager {
  constructor() {
    this.sounds = {};
    this.isLoaded = false;
    this.init();
  }

  async init() {
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

    this.sounds = loadedSounds;
    this.isLoaded = true;
  }

  playSound(soundType) {
    try {
      if (this.sounds[soundType]) {
        this.sounds[soundType].currentTime = 0;
        this.sounds[soundType].play().catch((error) => {
          // Sound play prevented by browser (user interaction required)
        });
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundType}`, error);
    }
  }
}

// Create global instance
const directSoundManager = new DirectSoundManager();

// Export functions for direct use
export const playDirectSound = (soundType) => {
  directSoundManager.playSound(soundType);
};

export const getDirectSounds = () => {
  return {
    sounds: directSoundManager.sounds,
    isLoaded: directSoundManager.isLoaded,
    playSound: directSoundManager.playSound.bind(directSoundManager),
  };
};

export default directSoundManager;
