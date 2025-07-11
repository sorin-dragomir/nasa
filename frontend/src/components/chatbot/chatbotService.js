const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Send a message to the chatbot API and get a response
 * @param {string} message - The user's message
 * @returns {Promise<{response: string}>} - The chatbot's response
 */
export async function sendMessageToChatbot(message) {
  console.log('🚀 Sending message to chatbot:', message);
  console.log('🔗 API URL:', `${API_URL}/v1/chatbot/message`);
  
  try {
    const response = await fetch(`${API_URL}/v1/chatbot/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
      }),
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Received response:', data);
    
    // Backend returns: { success: true, data: { response: "...", source: "..." } }
    // We need to extract the response from data.data.response
    if (data.success && data.data && data.data.response) {
      return {
        response: data.data.response,
        source: data.data.source
      };
    } else {
      throw new Error('Invalid response format from server');
    }
  } catch (error) {
    console.error('❌ Error sending message to chatbot:', error);
    
    // Fallback response for when the API is not available
    return {
      response: "I'm sorry, I'm having trouble connecting to my AI knowledge base right now. Please try again in a moment. The chatbot uses advanced AI to answer your space questions! 🚀🤖",
    };
  }
}
