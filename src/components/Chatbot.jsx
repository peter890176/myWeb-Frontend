import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Ensure you have axios installed: npm install axios or yarn add axios
import './Chatbot.css'; // We'll add styles for this later

// Replace with your actual API Gateway endpoint
const API_ENDPOINT = 'https://j7eeswd4a5.execute-api.us-east-1.amazonaws.com/dev/MyPersonaChatbot'; 

function Chatbot() {
    const [messages, setMessages] = useState([]); // To store chat messages: { text: string, sender: 'user' | 'bot' }
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false); // Controls visibility of message area and button icon
    const messagesEndRef = useRef(null); // For auto-scrolling to the bottom

    useEffect(() => {
        // Only scroll if chat is active and messages are visible
        if (isChatActive && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isChatActive]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.trim()) return;

        if (!isChatActive) {
            setIsChatActive(true); // Expand message area on first submit if it was closed
        }

        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        const currentInput = inputValue; // Store before clearing
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await axios.post(API_ENDPOINT, {
                user_query: currentInput // Use the stored input
            });
            
            if (response.data && response.data.answer) {
                const botMessage = { text: response.data.answer, sender: 'bot' };
                setMessages(prevMessages => [...prevMessages, botMessage]);
            } else {
                const errorMessage = { text: "Sorry, I didn't get a valid response from the bot.", sender: 'bot' };
                setMessages(prevMessages => [...prevMessages, errorMessage]);
            }
        } catch (error) {
            console.error('Error sending message to chatbot API:', error);
            let detailedError = "Sorry, I'm having trouble connecting. Please try again later.";
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                detailedError = `Sorry, there was an issue with the server (Status: ${error.response.status}). Please try again.`;
                if (error.response.status === 403) {
                    detailedError = "Access to the chatbot service is forbidden. Please check the API Gateway CORS configuration and ensure the API is deployed.";
                } else if (error.response.status === 500 || error.response.status === 502 || error.response.status === 503 || error.response.status === 504) {
                     detailedError = "The chatbot service seems to be temporarily unavailable or encountered an error. Please try again later.";
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("Error request:", error.request);
                detailedError = "No response received from the chatbot service. Please check your internet connection and the API endpoint.";
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
            const networkErrorMessage = { text: detailedError, sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, networkErrorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChatMessagesVisibility = () => {
        setIsChatActive(!isChatActive);
    };

    return (
        <div className={`chatbot-container ${isChatActive ? 'active' : 'inactive'}`}>
            <div className="chatbot-header">
                <button 
                    onClick={toggleChatMessagesVisibility} 
                    className="chatbot-toggle-button"
                    aria-label={isChatActive ? "Close Chat" : "Open Chat"}
                >
                    {isChatActive ? '\u2715' : '\u2921'} {/* X : NORTH WEST AND SOUTH EAST ARROW (expand) */}
                </button>
            </div>

            {isChatActive && (
                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {/* Simple rendering of text, consider a library for markdown or HTML if needed */}
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    {/* Empty div for auto-scrolling */}
                    <div ref={messagesEndRef} /> 
                </div>
            )}
            
            {/* Input form is always visible */} 
            <form onSubmit={handleSubmit} className="chatbot-input-form">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Ask me something..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Send</button>
            </form>
            {isChatActive && isLoading && <div className="loading-indicator">Bot is typing...</div>}
        </div>
    );
}

export default Chatbot;
