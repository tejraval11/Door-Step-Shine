import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={toggleChatbot}
          style={{
            backgroundColor: '#4CAF50',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          title="Chat with us"
        >
          <span style={{ color: 'white', fontSize: '24px' }}>💬</span>
        </button>
      ) : (
        <div style={{ position: 'relative' }}>
          <iframe 
            src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/11/14/06/20241114063016-OGT3U3XU.json"
            style={{ width: '400px', height: '600px', border: 'none', marginTop: '10px' }}
            title="Chatbot"
          ></iframe>
          <button 
            onClick={toggleChatbot}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: '#FF5733',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            title="Close Chat"
          >
            ✖️
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
