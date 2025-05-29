import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Ensure you have axios installed: npm install axios or yarn add axios
import './Chatbot.css'; // We'll add styles for this later

// Replace with your actual API Gateway endpoint
const API_ENDPOINT = 'https://j7eeswd4a5.execute-api.us-east-1.amazonaws.com/dev/MyPersonaChatbot'; 

// Add a prop to receive a function to set input value from parent
// Add scrollToSection prop
function Chatbot({ setExternalInputValue, scrollToSection }) {
    const [messages, setMessages] = useState([]); // To store chat messages: { text: string, sender: 'user' | 'bot' }
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false); // Controls visibility of message area and button icon
    const messagesEndRef = useRef(null); // Ref is kept, but auto-scroll logic is removed
    const inputRef = useRef(null);     // Ref for input, auto-focus on expand/submit removed

    /* REMOVED: Internal messages auto-scroll useEffect
    useEffect(() => {
        // This was for internal message auto-scroll
        if (isChatActive && messagesEndRef.current) {
            requestAnimationFrame(() => {
                // messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            });
        }
    }, [messages, isChatActive]);
    */

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    /* const focusInputWithPreventScroll = (delay = 50) => {
        // This helper function is no longer used
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus({ preventScroll: true });
            }
        }, delay);
    }; 
    */

    useEffect(() => {
        // For example prompt clicks
        if (setExternalInputValue) {
            setExternalInputValue.current = (value) => {
                setInputValue(value);
                // No focus management here
            };
        }
    }, [setExternalInputValue]);

    const toggleChatMessagesVisibility = () => {
        // Simply toggle active state
        setIsChatActive(prevIsChatActive => !prevIsChatActive);
        // No focus or scroll management here
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inputValue.trim()) return;

        if (!isChatActive) {
            setIsChatActive(true);
        }

        const userMessage = { text: inputValue, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        const currentInput = inputValue;
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await axios.post(API_ENDPOINT, {
                user_query: currentInput
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
                detailedError = `Sorry, there was an issue with the server (Status: ${error.response.status}).`;
                if (error.response.status === 403) {
                    detailedError = "Access to the chatbot service is forbidden.";
                } else if (error.response.status >= 500) {
                     detailedError = "The chatbot service seems to be temporarily unavailable.";
                }
            } else if (error.request) {
                detailedError = "No response received from the chatbot service.";
            }
            const networkErrorMessage = { text: detailedError, sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, networkErrorMessage]);
        } finally {
            setIsLoading(false);
            // No focus or scroll management here
        }
    };

    return (
        <div className={`chatbot-container ${isChatActive ? 'active' : 'inactive'}`}>
            <div className="chatbot-ai-tag">Peter's Agent</div>
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
            
            <form onSubmit={handleSubmit} className="chatbot-input-form"> {/* Form is now direct child */}
                <input
                    ref={inputRef} // Assign ref to the input field
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
