const axios = require("axios");
const logger = require("../shared/utils/logger");
const { InferenceClient } = require("@huggingface/inference");

class ChatbotService {
  constructor() {
    // Using Hugging Face's public inference API (must be available for public use)
    this.HUGGING_FACE_API =
      "https://api-inference.huggingface.co/models/HuggingFaceTB/SmolLM3-3B";

    // You can get a free API key from huggingface.co
    this.API_KEY = process.env.HUGGING_FACE_API_KEY;
    console.log(
      "process.env.HUGGING_FACE_API_KEY",
      process.env.HUGGING_FACE_API_KEY
    );

    // Enhanced space knowledge base for better responses
    this.spaceKnowledge = {
      "solar eclipse": {
        keywords: ["solar eclipse", "eclipse", "sun moon"],
        response:
          "Solar eclipses occur when the Moon passes between Earth and the Sun, casting a shadow on our planet. The next total solar eclipse visible from North America will be on August 23, 2044. During totality, you can safely look at the Sun with the naked eye and see the corona - the Sun's outer atmosphere. Total solar eclipses last only a few minutes and are one of nature's most spectacular phenomena! 🌑✨",
      },
      "black hole": {
        keywords: ["black hole", "event horizon", "singularity"],
        response:
          "Black holes are among the most fascinating objects in the universe! They're regions where gravity is so strong that nothing - not even light - can escape once it crosses the event horizon. They form when massive stars (at least 25 times our Sun's mass) collapse at the end of their lives. The closest known black hole is about 1,000 light-years away. Fun fact: If you fell into a black hole, time would appear to slow down due to extreme gravitational time dilation! 🕳️⚫",
      },
      mars: {
        keywords: ["mars", "red planet", "perseverance", "rover"],
        response:
          "Mars, the Red Planet, is one of our most studied neighbors! It's red due to iron oxide (rust) on its surface. Currently, NASA's Perseverance rover is exploring Jezero Crater, searching for signs of ancient microbial life. Mars has two small moons (Phobos and Deimos), massive dust storms that can cover the entire planet, and the largest volcano in the solar system - Olympus Mons! A journey to Mars takes 6-9 months. 🔴🚀",
      },
      iss: {
        keywords: [
          "iss",
          "international space station",
          "space station",
          "orbit",
        ],
        response:
          "The International Space Station (ISS) is humanity's outpost in space! It orbits Earth at about 408 km altitude, traveling at 27,600 km/h. It completes one orbit every 90 minutes, meaning astronauts see 16 sunrises and sunsets each day! The ISS has been continuously inhabited since November 2000 and serves as a laboratory for scientific research in microgravity. You can often see it with the naked eye as it passes overhead! 🛰️🌍",
      },
      moon: {
        keywords: ["moon", "lunar", "artemis", "apollo"],
        response:
          "Our Moon is Earth's only natural satellite and our cosmic companion for over 4.5 billion years! It's gradually moving away from Earth at 3.8 cm per year. The Moon influences our tides, stabilizes Earth's axial tilt, and may have been crucial for the development of life. NASA's Artemis program plans to return humans to the Moon by 2026, including the first woman and person of color. The Moon has water ice at its poles! 🌙👩‍🚀",
      },
      jupiter: {
        keywords: ["jupiter", "great red spot", "io", "europa", "ganymede"],
        response:
          "Jupiter is the king of planets! This gas giant has a mass greater than all other planets combined and acts as our solar system's vacuum cleaner, protecting inner planets from asteroids and comets. Its Great Red Spot is a storm larger than Earth that's been raging for centuries! Jupiter has over 80 moons, including Europa (which may have a subsurface ocean with more water than Earth's oceans!) and Io (the most volcanically active body in the solar system). 🪐⚡",
      },
      saturn: {
        keywords: ["saturn", "rings", "titan", "cassini"],
        response:
          "Saturn is the jewel of our solar system with its spectacular ring system! These rings are made of countless ice and rock particles, some as small as dust, others as large as houses. Saturn is so light it could float in water! It has 83 known moons, including Titan - larger than Mercury and with a thick atmosphere and methane lakes. The Cassini mission revealed Saturn's incredible complexity before its dramatic finale in 2017. 🪐💍",
      },
      sun: {
        keywords: ["sun", "solar", "parker probe", "corona"],
        response:
          "Our Sun is a middle-aged star that's been shining for 4.6 billion years and will continue for another 5 billion! It's a massive ball of hydrogen and helium, with temperatures reaching 15 million°C at its core. The Parker Solar Probe is currently 'touching' the Sun, flying through its corona at incredible speeds. Solar storms from our Sun can affect satellites, power grids, and create beautiful auroras! Every second, the Sun converts 4 million tons of matter into energy! ☀️🔥",
      },
      telescope: {
        keywords: [
          "telescope",
          "hubble",
          "james webb",
          "jwst",
          "space telescope",
        ],
        response:
          "Space telescopes are our windows to the universe! The Hubble Space Telescope has been our eye in the sky since 1990, capturing breathtaking images and revolutionizing astronomy. The James Webb Space Telescope (launched 2021) is even more powerful - it sees in infrared and can look back to when the first galaxies formed! These telescopes have discovered exoplanets, dark energy, and shown us the universe is far stranger and more beautiful than we imagined. 🔭🌌",
      },
      rocket: {
        keywords: ["rocket", "spacex", "sls", "falcon heavy", "propulsion"],
        response:
          "Rockets are humanity's vehicles to the stars! They work by Newton's third law - for every action, there's an equal and opposite reaction. Modern rockets like SpaceX's Falcon Heavy and NASA's SLS can lift massive payloads to space. The escape velocity needed to leave Earth is 11.2 km/s (25,000 mph)! Future rockets might use ion drives, nuclear propulsion, or even theoretical concepts like fusion ramjets for interstellar travel. 🚀⚡",
      },
      exoplanet: {
        keywords: ["exoplanet", "kepler", "tess", "habitable zone"],
        response:
          "Exoplanets are worlds beyond our solar system, and we've discovered over 5,000 of them! NASA's Kepler and TESS missions have shown that planets are incredibly common - nearly every star has at least one planet. Some exoplanets are in the 'habitable zone' where liquid water could exist. We've found hot Jupiters, super-Earths, and even planets orbiting multiple stars like Tatooine from Star Wars! 🪐🌟",
      },
    };
  }

  // Find the best match from our knowledge base
  findBestResponse(question) {
    const lowerQuestion = question.toLowerCase();

    for (const [topic, data] of Object.entries(this.spaceKnowledge)) {
      for (const keyword of data.keywords) {
        if (lowerQuestion.includes(keyword)) {
          return data.response;
        }
      }
    }

    return null;
  }

  // Fallback responses for general queries
  getGeneralResponse(question) {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi")) {
      return "Hello there, space explorer! I'm your NASA Assistant, ready to answer questions about space, astronomy, and our incredible universe. What cosmic mystery would you like to explore today? 🌟🚀";
    }

    if (lowerQuestion.includes("thank") || lowerQuestion.includes("thanks")) {
      return "You're very welcome! I love sharing the wonders of space and science. Keep exploring, keep questioning, and remember - we're all made of star stuff! ✨🌌";
    }

    if (lowerQuestion.includes("nasa")) {
      return "NASA (National Aeronautics and Space Administration) has been pushing the boundaries of space exploration since 1958! We've landed on the Moon, sent rovers to Mars, launched incredible space telescopes, and continue to explore the cosmos. Our motto is 'For the Benefit of All' because space exploration benefits everyone on Earth! 🚀👨‍🚀";
    }

    if (lowerQuestion.includes("life") || lowerQuestion.includes("alien")) {
      return "The search for life beyond Earth is one of humanity's greatest quests! While we haven't found definitive proof of extraterrestrial life yet, we're actively looking. The James Webb telescope studies exoplanet atmospheres for biosignatures, missions to Mars search for ancient life, and we're exploring Europa and Enceladus for potential microbial life in their subsurface oceans. The universe is vast - life is probably out there! 👽🔬";
    }

    return "That's a fascinating question about space! While I specialize in astronomy and space exploration topics, I'd love to help you explore the cosmos. Feel free to ask me about planets, stars, space missions, black holes, or any other space-related topics. The universe is full of incredible mysteries waiting to be discovered! 🌌✨";
  }

  async getChatbotResponse(message) {
    try {
      logger.info(`Processing chatbot message: ${message}`);

      // First, try to find a response in our enhanced knowledge base
      const knowledgeResponse = this.findBestResponse(message);
      if (knowledgeResponse) {
        return {
          success: true,
          response: knowledgeResponse,
          source: "knowledge_base",
        };
      }
      console.log("this.API_KEY", this.API_KEY);
      // If we have HuggingFace API key, try AI response
      if (this.API_KEY) {
        try {
          const response = await this.getAIResponse(message);
          if (response) {
            return {
              success: true,
              response: response,
              source: "ai",
            };
          }
        } catch (error) {
          logger.warn(
            "AI response failed, falling back to general response:",
            error.message
          );
        }
      }

      // Fallback to general responses
      const generalResponse = this.getGeneralResponse(message);
      return {
        success: true,
        response: generalResponse,
        source: "general",
      };
    } catch (error) {
      logger.error("Error in getChatbotResponse:", error);
      return {
        success: false,
        error:
          "Sorry, I encountered an error processing your question. Please try again!",
        source: "error",
      };
    }
  }

  async getAIResponse(message) {
    try {
      const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);
      const chatCompletion = await client.chatCompletion({
        provider: "hf-inference",
        model: "HuggingFaceTB/SmolLM3-3B", // You can change to another chat model
        messages: [
          {
            role: "system",
            content:
              "You are a helpful educational assistant. When responding, give detailed, structured, and clear answers using markdown formatting (like bold titles, bullet points, and sections). Keep it informative and easy to understand. Always avoid including any <think> or internal reasoning in the final answer. Only return the final, user-facing answer in readable markdown.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000, // Only if supported by the client and model
      });

      if (chatCompletion.choices && chatCompletion.choices.length > 0) {
        let answer = chatCompletion.choices[0].message.content;

        // Convert literal '\n' into real line breaks
        answer = answer.replace(/\\n/g, "\n");

        // Optional: remove <think> blocks and timestamps (if present)
        answer = answer.replace(/<think>[\s\S]*?<\/think>/gi, "");
        answer = answer.replace(/^\d{2}:\d{2} (AM|PM)\s*/i, "");

        // Add extra spacing for markdown rendering improvements
        answer = answer
          .replace(/(#+\s.*)/g, "$1\n\n") // Markdown headers
          .replace(/(-\s.*)/g, "$1\n") // Bullet points
          .replace(/(\d+\.\s.*)/g, "$1\n") // Numbered lists
          .replace(/(\*\*.*?\*\*)/g, "$1\n") // Bold phrases
          .replace(/\.\s([A-Z])/g, ".\n$1"); // Sentence breaks

        // Trim whitespace
        return answer.trim();
      }

      return null;
    } catch (error) {
      console.error("HF SDK error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      return null;
    }
  }
}

module.exports = { ChatbotService };
