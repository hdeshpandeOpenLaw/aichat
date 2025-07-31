import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://openlaw-backend-235711411230.us-central1.run.app";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const ChatModal = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isInActiveConversation, setIsInActiveConversation] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentMatches, setCurrentMatches] = useState([]);
  const [showSchedulingSidebar, setShowSchedulingSidebar] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [bookingStage, setBookingStage] = useState('initial'); // 'initial', 'contact', 'confirmation'
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    helpReason: ''
  });
  
  // Chat history state
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatTitle, setCurrentChatTitle] = useState('New chat');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [visibleChats, setVisibleChats] = useState(10); // Show first 10 chats
  const CHATS_PER_PAGE = 10;
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const MESSAGE_LIMIT = 15;
  const inputRef = useRef(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(44); // Default height for single line
  const hasInitialQueryBeenSentRef = useRef(false);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Focus input field when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Generate AI title for chat based on conversation
  const generateChatTitle = async (messages) => {
    if (messages.length < 2) return 'New chat';
    
    try {
      // Get the first few messages to generate a title
      const conversationText = messages
        .slice(0, 3) // Take first 3 messages
        .map(msg => msg.message)
        .join(' ')
        .substring(0, 200); // Limit to 200 characters
      
      const response = await axios.post(`${API_BASE_URL}/generate-title`, {
        conversation: conversationText
      }, {
        timeout: 5000 // 5 second timeout
      });
      
      if (response.data && response.data.title) {
        return response.data.title;
      }
    } catch (error) {
      console.error('Error generating title:', error);
      // Don't throw the error, just log it and continue with fallback
      // This could be due to backend not running, network issues, or API errors
    }
    
    // Fallback: use first user message or default title
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (firstUserMessage) {
      const title = firstUserMessage.message.replace(/<[^>]*>/g, '').substring(0, 30);
      return title + (title.length >= 30 ? '...' : '');
    }
    
    return 'New chat';
  };

  // Save chat to history
  const saveChatToHistory = async (chatId, messages, title) => {
    const chatEntry = {
      id: chatId,
      title: title,
      messages: messages,
      timestamp: new Date(),
      lastMessage: messages[messages.length - 1]?.message || ''
    };
    
    setChatHistory(prev => {
      const existingIndex = prev.findIndex(chat => chat.id === chatId);
      let updatedHistory;
      if (existingIndex >= 0) {
        // Update existing chat
        const updated = [...prev];
        updated[existingIndex] = chatEntry;
        updatedHistory = updated;
      } else {
        // Add new chat
        updatedHistory = [chatEntry, ...prev];
      }
      
      // Save to localStorage
      localStorage.setItem('openlaw_chat_history', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  // Load chat from history
  const loadChatFromHistory = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chat.id);
      setCurrentChatTitle(chat.title);
      setIsInActiveConversation(true);
      setMessageCount(chat.messages.length);
      
      // Focus the input field after loading chat
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // Delete chat from history
  const deleteChatFromHistory = (chatId, event) => {
    event.stopPropagation(); // Prevent loading the chat when clicking delete
    
    // Set confirmation state
    setDeleteConfirmation({ chatId: chatId, event: event });
  };

  // Confirm delete chat
  const confirmDeleteChat = () => {
    if (!deleteConfirmation) return;
    
    const { chatId } = deleteConfirmation;
    
    // Remove from state
    setChatHistory(prev => {
      const updated = prev.filter(chat => chat.id !== chatId);
      
      // Save to localStorage
      localStorage.setItem('openlaw_chat_history', JSON.stringify(updated));
      
      return updated;
    });
    
    // If we're deleting the current chat, start a new chat
    if (currentChatId === chatId) {
      startNewChat();
    }
    
    // Clear confirmation
    setDeleteConfirmation(null);
  };

  // Cancel delete
  const cancelDeleteChat = () => {
    setDeleteConfirmation(null);
  };

  // Load more chats
  const loadMoreChats = () => {
    setVisibleChats(prev => prev + CHATS_PER_PAGE);
  };

  // Reset visible chats when starting new chat
  const resetVisibleChats = () => {
    setVisibleChats(CHATS_PER_PAGE);
  };

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('openlaw_chat_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setChatHistory(parsed);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Function to convert markdown to HTML
  const convertMarkdownToHtml = (text) => {
    if (!text) return '';
    

    
    let result = text;
    
    // More aggressive bold conversion - catch any **text** pattern
    result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // More aggressive italic conversion - catch any *text* pattern
    result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Convert line breaks to <br>
    result = result.replace(/\n/g, '<br>');

    return result;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputFocused) {
      scrollToBottom();
    }
  }, [inputFocused]);

  useEffect(() => {
    if (isOpen && initialQuery && !hasInitialQueryBeenSentRef.current) {
      setQuery(initialQuery);
      hasInitialQueryBeenSentRef.current = true;
      handleSendQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const appendMessage = (sender, message, isHtml = false) => {
    // Auto-detect if message contains HTML tags
    const containsHtml = /<[^>]*>/g.test(message);
    const shouldRenderAsHtml = isHtml || containsHtml;
    
    const newMessage = {
      id: Date.now() + Math.random(), // Add random component to ensure uniqueness
      sender,
      message,
      isHtml: shouldRenderAsHtml,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Focus the input field after AI responses
    if (sender === 'ai') {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const displayGeneratedDocument = async (content, type, filename) => {
    // Create unique ID for this download button
    const downloadId = `download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const documentHtml = `
      <div class="generated-document">
        <h4>Generated Document: ${filename || `document.${type}`}</h4>
        <div class="document-content">
          <div class="document-scroll-container">
            <pre class="document-text">${content}</pre>
          </div>
        </div>
        <button class="btn btn-primary download-btn" id="${downloadId}">
          <i class="bi bi-download"></i> Download Document
        </button>
      </div>
    `;
    
    appendMessage('ai', documentHtml, true);
    
    // Add click event listener after the HTML is rendered
    setTimeout(() => {
      const downloadBtn = document.getElementById(downloadId);
      if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
          try {
            // Show loading state
            downloadBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Generating...';
            downloadBtn.disabled = true;
            
            // Call the backend to generate the actual .docx file
            const formData = new FormData();
            formData.append('document_content', content);
            formData.append('document_type', type);
            formData.append('filename', filename || `document.${type}`);
            
            const response = await axios.post(`${API_BASE_URL}/generate-document`, formData, {
              responseType: 'blob',
              timeout: 30000
            });
            
            // Create download link
            const blob = new Blob([response.data], { 
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename || `document.${type}`;
            downloadLink.click();
            
            // Clean up
            URL.revokeObjectURL(downloadLink.href);
            
            // Reset button
            downloadBtn.innerHTML = '<i class="bi bi-download"></i> Download Document';
            downloadBtn.disabled = false;
            
          } catch (error) {
            console.error('Error downloading document:', error);
            downloadBtn.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Download Failed';
            downloadBtn.disabled = false;
            
            // Show error message
            appendMessage('ai', `<strong>Download Error:</strong> Could not download the document. Please try again.<br><em>${String(error)}</em>`, true);
          }
        });
      }
    }, 100);
  };

  const handleSendQuery = async (queryText = null) => {
    const queryToSend = queryText || query.trim();
    const file = selectedFile;

    if (!queryToSend && !file) {
      if (!isInActiveConversation && !currentChatId) {
        appendMessage('ai', "Please enter a query or upload a document.");
      }
      return;
    }

    
    if (messageCount >= MESSAGE_LIMIT) {
      setShowLoginModal(true);
      return;
    }

    setMessageCount(prev => {
      const newCount = prev + 1;

      if (newCount >= MESSAGE_LIMIT) {
        setTimeout(() => setShowLoginModal(true), 1000);
      }
      return newCount;
    });

    // Create user message content that includes both text and file info
    let userMessageContent = '';
    if (queryToSend) {
      userMessageContent += queryToSend;
    }
    if (file) {
      if (userMessageContent) userMessageContent += '<br>';
      userMessageContent += `<div class="attached-file-in-chat">
        <i class="bi bi-file-earmark-text"></i>
        <strong>${file.name}</strong>
        <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
      </div>`;
    }

    appendMessage('user', userMessageContent, true);
    setQuery('');
    setInputHeight(44); // Reset input height after sending
    setSelectedFile(null);
    setIsInActiveConversation(true);

    const loadingMessageId = `loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    appendMessage('ai', `<div id="${loadingMessageId}" class="loading-message"><img src="/loadinggif.gif" alt="Thinking..." /><span>Thinking...</span></div>`, true);
    setIsLoading(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    const formData = new FormData();
    formData.append("query", queryToSend);
    if (currentChatId) {
      formData.append("chat_id", currentChatId);
    }
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/search`, formData, {
        signal: abortControllerRef.current.signal,
        timeout: 30000 // 30 second timeout
      });
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.message.includes(loadingMessageId)));
      setIsLoading(false);
      
      // Focus the input field after response is complete
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      const data = response.data;

      if (data.chat_id && !currentChatId) {
        setCurrentChatId(data.chat_id);
      }

      // Save chat to history after receiving response
      if (data.chat_id) {
        const updatedMessages = [...messages, {
          id: Date.now() + Math.random(),
          sender: 'user',
          message: userMessageContent,
          isHtml: true,
          timestamp: new Date()
        }, {
          id: Date.now() + Math.random() + 1,
          sender: 'ai',
          message: data.answer || data.message || 'Response received',
          isHtml: false,
          timestamp: new Date()
        }];
        
        // Generate title for new chats
        if (!currentChatId) {
          const title = await generateChatTitle(updatedMessages);
          setCurrentChatTitle(title);
          await saveChatToHistory(data.chat_id, updatedMessages, title);
        } else {
          // Update existing chat
          const title = currentChatTitle || await generateChatTitle(updatedMessages);
          await saveChatToHistory(data.chat_id, updatedMessages, title);
        }
      }

      if (data.error) {
        appendMessage('ai', `Sorry, an error occurred: ${data.error}`);
        return;
      }

      if (data.intent === "near_me") {
        findNearMe();
        return;
      }

      if (data.answer) {
        appendMessage('ai', data.answer, true);
        
        if (data.document_content) {
          await displayGeneratedDocument(data.document_content, data.document_type, data.download_filename);
        }
        
        if (data.completion_message) {
          appendMessage('ai', data.completion_message, true);
        }
        return;
      }

      if (data.matches && data.matches.length > 0) {
        displayLawyerMatches(data.matches, data.filters_applied);
      } else {
        appendMessage('ai', "No matching lawyers found. Please try a broader search.");
      }

    } catch (err) {
      setMessages(prev => prev.filter(msg => !msg.message.includes(loadingMessageId)));
      setIsLoading(false);
      
      // Focus the input field after error response
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
      // Check if the error is due to abort
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        appendMessage('ai', 'Request cancelled by user.', true);
      } else if (err.response && err.response.status === 500) {
        appendMessage('ai', `<strong>Server Error:</strong> The server encountered an error. Please try again later.<br><em>${err.response.data?.error || 'Internal server error'}</em>`, true);
      } else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        appendMessage('ai', `<strong>Connection Error:</strong> Could not connect to the server. Please ensure the backend is running on port 8000.<br><em>${String(err)}</em>`, true);
      } else {
        appendMessage('ai', `<strong>Error:</strong> Could not connect to the server. Please ensure it is running and try again.<br><em>${String(err)}</em>`, true);
      }
      
      // Clear the abort controller
      abortControllerRef.current = null;
    }
  };

  const handleStopRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const displayLawyerMatches = (matches, filters_applied) => {
    
    // Set the current matches immediately
    setCurrentMatches(matches);
    
    let introHtml = `<p>I have found ${matches.length} attorneys who best match your request. You can select one from the cards below to book an appointment.</p>`;

    let carouselHtml = '<div class="lawyer-card-carousel-container">';
    carouselHtml += '<div class="lawyer-card-carousel">';
    matches.forEach((lawyer, index) => {
      const licenseState = Array.isArray(lawyer.licenseState) ? lawyer.licenseState.join(', ') : lawyer.licenseState;
      carouselHtml += `
        <div class="lawyer-card-horizontal" data-lawyer-index="${index}">
          <img src="https://i.pravatar.cc/150?img=${index + 1}" alt="${lawyer.name}" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${lawyer.name}</h5>
            <p class="card-text">${lawyer.explanation || 'Legal Counsel'}</p>
            <p class="card-text"><small class="text-muted">⭐ ${lawyer.rating || 'N/A'} • ${licenseState}</small></p>
          </div>
        </div>
      `;
    });
    carouselHtml += '</div>';
    carouselHtml += `
      <div class="carousel-nav">
        <button class="carousel-btn prev"><i class="bi bi-chevron-left"></i></button>
        <button class="carousel-btn next"><i class="bi bi-chevron-right"></i></button>
      </div>
    `;
    carouselHtml += '</div>';

    const finalHtml = introHtml + carouselHtml;
    appendMessage('ai', finalHtml, true);

    // Add event delegation to the chat messages container with closure to capture matches
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        // Remove any existing click listeners to avoid duplicates
        chatMessages.removeEventListener('click', chatMessages.lawyerCardClickHandler);
        
        // Create new click handler with closure to capture current matches
        chatMessages.lawyerCardClickHandler = (e) => {
          const lawyerCard = e.target.closest('.lawyer-card-horizontal');
          if (lawyerCard) {
            const lawyerIndex = parseInt(lawyerCard.getAttribute('data-lawyer-index'));
            handleLawyerSelectionWithData(lawyerIndex, matches);
          }
        };
        
        chatMessages.addEventListener('click', chatMessages.lawyerCardClickHandler);
      }
      
      // Add visual feedback for clickable cards
      const lawyerCards = document.querySelectorAll('.lawyer-card-horizontal');
      lawyerCards.forEach((card) => {
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.2s ease';
      });
    }, 100);
  };

  const handleLawyerSelectionWithData = (lawyerIndex, matchesData) => {
    
    const lawyer = matchesData[lawyerIndex];
    
    if (lawyer) {
      setSelectedLawyer(lawyer);
      setShowSchedulingSidebar(true);
      setBookingStage('initial');
      setSelectedTime(null);
      setSelectedDay(null);
      setSelectedUrgency(null);
      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        helpReason: ''
      });
      // Remove the "Great choice" message - just open the sidebar
    } else {
    }
  };

  const handleDaySelection = (day) => {
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  const handleUrgencySelection = (urgency) => {
    setSelectedUrgency(urgency);
    setBookingStage('contact');
  };

  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactFormSubmit = () => {
    // Validate required fields
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.phone || !contactForm.helpReason) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setBookingStage('confirmation');
    
    // Auto-close sidebar after 2.5 seconds and send confirmation message
    setTimeout(() => {
      setShowSchedulingSidebar(false);
      setBookingStage('initial');
      
      // Send confirmation message to chat
      const timeText = selectedTime ? ` for January 14 at ${selectedTime}` : '';
      const urgencyText = selectedUrgency ? ` (${selectedUrgency})` : '';
      const message = `${contactForm.firstName}, your meeting with <strong>${selectedLawyer.name}</strong>${timeText}${urgencyText} is scheduled. You will receive an email with the details shortly. You can view it in your newly <a href="#">created profile</a>.`;
      appendMessage('ai', message, true);
    }, 2500);
  };

  const closeSchedulingSidebar = () => {
    setShowSchedulingSidebar(false);
    setBookingStage('initial');
    setSelectedTime(null);
    setSelectedDay(null);
    setSelectedUrgency(null);
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      helpReason: ''
    });
  };

  const findNearMe = async () => {
    if (!navigator.geolocation) {
      appendMessage('ai', "Geolocation is not supported by your browser.");
      return;
    }

    appendMessage('ai', "<span class=\"loading-dots\">Getting your location</span>", true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const geoData = geoResponse.data;
      
      const city = geoData.address.city || geoData.address.town || geoData.address.village;
      const state = geoData.address.state;

      if (city && state) {
        const locationQuery = `lawyers in ${city}, ${state}`;
        handleSendQuery(locationQuery);
      } else {
        appendMessage('ai', "Could not determine your location.");
      }
    } catch (error) {
      appendMessage('ai', `Error getting location: ${error.message}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto-resize the textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = 20; // Approximate line height
    const maxHeight = lineHeight * 6; // 6 lines max
    
    if (scrollHeight <= maxHeight) {
      const newHeight = Math.max(44, scrollHeight); // Minimum height of 44px
      setInputHeight(newHeight);
      textarea.style.height = `${newHeight}px`;
    } else {
      setInputHeight(maxHeight);
      textarea.style.height = `${maxHeight}px`;
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setQuery('');
    setInputHeight(44); // Reset input height
    setCurrentChatId(null);
    setCurrentChatTitle('New chat');
    setMessageCount(0);
    setIsInActiveConversation(false);
    setCurrentMatches([]);
    setSelectedFile(null);
    setShowSchedulingSidebar(false);
    setSelectedLawyer(null);
    setBookingStage('initial');
    setSelectedTime(null);
    setSelectedDay(null);
    setSelectedUrgency(null);
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      helpReason: ''
    });
    hasInitialQueryBeenSentRef.current = false; // Reset the flag for new chats
    resetVisibleChats(); // Reset visible chats when starting new chat
    
    // Clear any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    
    // Focus the input field after starting new chat
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // NEW: sidebar toggle for mobile
  const isMobile = useIsMobile();

  // Wrapper function to reset flags before closing
  const handleClose = () => {
    hasInitialQueryBeenSentRef.current = false;
    
    // Clear any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    
    onClose();
  };

  return (
    <div className={`chat-modal-container ${isOpen ? 'visible' : ''}`}>
      <div className="chat-container">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && isMobile && (
          <div className="sidebar-mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        {/* Sidebar */}
        <aside
          className={`sidebar${isSidebarOpen ? ' sidebar-mobile-open' : ''} d-none d-lg-flex`}
          style={isSidebarOpen ? { zIndex: 1200 } : {}}
        >
          {/* Mobile close button */}
          <button
            className="sidebar-mobile-close d-lg-none"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 1300 }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <div className="sidebar-header">
            <img src="/ol-logo.svg" alt="OpenLaw Logo" className="logo" />
          </div>
          <button className="btn btn-light new-chat-btn" onClick={startNewChat}>
            <i className="bi bi-plus"></i> Start new chat
          </button>
          <div className="chat-history">
            <p className="history-title">Today</p>
            {chatHistory.length === 0 ? (
              <div className="history-item active">
                New chat
              </div>
            ) : (
              <>
                {!currentChatId && (
                  <div className="history-item active" onClick={startNewChat}>
                    New chat
                  </div>
                )}
                {chatHistory.slice(0, visibleChats).map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
                    onClick={() => loadChatFromHistory(chat.id)}
                    title={chat.title}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <span className="chat-title-text">{chat.title}</span>
                      </div>
                      <button 
                        className="delete-chat-btn" 
                        onClick={(e) => deleteChatFromHistory(chat.id, e)}
                        title="Delete chat"
                        style={{ 
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px'
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
                {chatHistory.length > visibleChats && (
                  <button className="load-more-chats-btn" onClick={loadMoreChats}>
                    <i className="bi bi-chevron-down"></i> Load More Chats
                  </button>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Main Chat Area: only show if not (mobile && sidebar open) */}
        {!(isSidebarOpen && isMobile) && (
          <main className="chat-area">
            {/* Header */}
            <header className="chat-header">
              <div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {/* Hamburger for mobile */}
                  <button
                    className="btn d-lg-none me-2"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open chat history"
                    style={{ fontSize: '1.5rem' }}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                  <div className="chat-title">
                    <i className="bi bi-chat-left"></i> {currentChatTitle}
                  </div>
                </div>
                <button className="btn-close" onClick={handleClose}></button>
              </div>
            </header>

            {/* Messages */}
            <div className={`chat-messages${inputFocused ? ' input-focused' : ''}`}>
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}-message`}>
                  {msg.sender === 'ai' && <img src="/oi-icon.jpg" alt="AI" className="avatar" />}
                  <div className="message-content">
                    <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(msg.message) }} />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
              {selectedFile && (
                <div className="attached-file-display">
                  <strong>{selectedFile.name}</strong>
                  <button onClick={removeFile}>×</button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
              <label 
                htmlFor="fileInput" 
                title="Attach a legal document" 
                className="attach-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined">attach_file</span>
              </label>
              <button 
                title="Find lawyers near me" 
                className="near-me-button"
                onClick={findNearMe}
              >
                <span className="material-symbols-outlined">distance</span>
              </button>
              <textarea 
                ref={inputRef}
                className="chat-input" 
                placeholder="Type your message here..." 
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                rows={1}
                style={{ height: `${inputHeight}px` }}
                onFocus={() => {
                  setInputFocused(true);
                  setTimeout(() => {
                    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                  }, 300);
                }}
                onBlur={() => setInputFocused(false)}
              />
              <button 
                className={`send-button ${isLoading ? 'stop-button' : ''}`}
                onClick={isLoading ? handleStopRequest : () => handleSendQuery()}
                disabled={false}
                title={isLoading ? "Stop request" : "Send message"}
              >
                {isLoading ? (
                  <i className="bi bi-stop-fill"></i>
                ) : (
                  "➤"
                )}
              </button>
            </div>
          </main>
        )}

        {/* Scheduling Sidebar - Inside Chat Container */}
        {showSchedulingSidebar && selectedLawyer && (
          <div className={`scheduling-sidebar ${showSchedulingSidebar ? 'visible' : ''}`}>
            <div className="sidebar-header">
              <button className="btn-close" onClick={closeSchedulingSidebar}></button>
            </div>
            <div className="sidebar-content">
              {bookingStage === 'confirmation' ? (
                <div className="confirmation-view">
                  <svg className="checkmark-circle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark-icon" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                  <h4>Appointment Scheduled!</h4>
                  <p>You will receive an email with the details shortly.</p>
                </div>
              ) : bookingStage === 'contact' ? (
                <div className="booking-form">
                  <h5>To book appointment, we need to verify a few things.</h5>
                  <div className="form-group">
                    <label htmlFor="help-reason">How can we help? *</label>
                    <textarea 
                      id="help-reason" 
                      rows="3" 
                      placeholder="Please describe your legal issue..."
                      value={contactForm.helpReason}
                      onChange={(e) => handleContactFormChange('helpReason', e.target.value)}
                    />
                    <small className="char-counter">{contactForm.helpReason.length}/1000</small>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first-name">First name *</label>
                      <input 
                        type="text" 
                        id="first-name" 
                        placeholder="e.g., Bianca"
                        value={contactForm.firstName}
                        onChange={(e) => handleContactFormChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="last-name">Last name *</label>
                      <input 
                        type="text" 
                        id="last-name" 
                        placeholder="e.g., Chablis"
                        value={contactForm.lastName}
                        onChange={(e) => handleContactFormChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="e.g., your.email@example.com"
                      value={contactForm.email}
                      onChange={(e) => handleContactFormChange('email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      placeholder="e.g., (555) 123-4567"
                      value={contactForm.phone}
                      onChange={(e) => handleContactFormChange('phone', e.target.value)}
                    />
                  </div>
                  <p className="terms-text">By booking you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
                  <button className="schedule-btn-main" onClick={handleContactFormSubmit}>
                    Schedule appointment
                  </button>
                </div>
              ) : (
                <>
                  <div className="sidebar-lawyer-profile">
                    <img src="https://i.pravatar.cc/150?img=1" alt={selectedLawyer.name} />
                    <div className="sidebar-lawyer-info">
                      <h4>{selectedLawyer.name} <i className="bi bi-check-circle-fill text-success"></i></h4>
                      <p>⭐ {selectedLawyer.rating || '5.00'} • 124 reviews</p>
                      <p>⚖️ Licensed in: {Array.isArray(selectedLawyer.licenseState) ? selectedLawyer.licenseState.join(', ') : selectedLawyer.licenseState}</p>
                    </div>
                  </div>
                  <div className="sidebar-lawyer-desc">
                    <p>{selectedLawyer.explanation || 'A highly skilled attorney.'}</p>
                  </div>
                  
                  {/* Check if lawyer has calendar connected */}
                  {selectedLawyer.hasCalendarConnected ? (
                    <>
                      <div className="availability-grid">
                        <h5>Availability</h5>
                        <div className="availability-days">
                          <button 
                            className={`day-btn ${selectedDay === 'today' ? 'active' : ''}`} 
                            onClick={() => handleDaySelection('today')}
                          >
                            <div className="day-name">Today</div>
                            <div className="day-appts">No appts</div>
                          </button>
                          <button 
                            className={`day-btn ${selectedDay === 'jan14' ? 'active' : ''}`} 
                            onClick={() => handleDaySelection('jan14')}
                          >
                            <div className="day-name">Jan 14</div>
                            <div className="day-appts">3 appt</div>
                          </button>
                          <button 
                            className={`day-btn ${selectedDay === 'jan15' ? 'active' : ''}`} 
                            onClick={() => handleDaySelection('jan15')}
                          >
                            <div className="day-name">Jan 15</div>
                            <div className="day-appts">No appts</div>
                          </button>
                          <button 
                            className={`day-btn ${selectedDay === 'jan16' ? 'active' : ''}`} 
                            onClick={() => handleDaySelection('jan16')}
                          >
                            <div className="day-name">Jan 16</div>
                            <div className="day-appts">4 appt</div>
                          </button>
                          <button 
                            className={`day-btn ${selectedDay === 'jan17' ? 'active' : ''}`} 
                            onClick={() => handleDaySelection('jan17')}
                          >
                            <div className="day-name">Jan 17</div>
                            <div className="day-appts">4 appt</div>
                          </button>
                        </div>
                      </div>
                      {(selectedDay && selectedDay !== 'today' && selectedDay !== 'jan15') && (
                        <div id="time-slots-container">
                          <h5>Available times:</h5>
                          <div className="time-slots">
                            <button 
                              className={`time-slot-btn ${selectedTime === '10:00 AM' ? 'active' : ''}`}
                              onClick={() => handleTimeSelection('10:00 AM')}
                            >
                              10:00 AM
                            </button>
                            <button 
                              className={`time-slot-btn ${selectedTime === '11:00 AM' ? 'active' : ''}`}
                              onClick={() => handleTimeSelection('11:00 AM')}
                            >
                              11:00 AM
                            </button>
                            <button 
                              className={`time-slot-btn ${selectedTime === '3:00 PM' ? 'active' : ''}`}
                              onClick={() => handleTimeSelection('3:00 PM')}
                            >
                              3:00 PM
                            </button>
                          </div>
                          <button 
                            className="schedule-btn-main" 
                            disabled={!selectedTime}
                            onClick={() => setBookingStage('contact')}
                          >
                            Schedule appointment
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="urgency-grid">
                      <h5>What is your urgency?</h5>
                      <div className="urgency-buttons">
                        <button className="urgency-btn" onClick={() => handleUrgencySelection('Very Urgent')}>
                          Very Urgent
                        </button>
                        <button className="urgency-btn" onClick={() => handleUrgencySelection('Urgent')}>
                          Urgent
                        </button>
                        <button className="urgency-btn" onClick={() => handleUrgencySelection('Not Urgent')}>
                          Not Urgent
                        </button>
                        <button className="urgency-btn" onClick={() => handleUrgencySelection('Not Sure')}>
                          Not Sure
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="modal-overlay visible">
          <div className="modal-content delete-confirmation-modal">
            <button className="modal-close-btn" onClick={cancelDeleteChat}>&times;</button>
            <div className="modal-header">
              <h3><i className="bi bi-trash text-danger"></i> Delete Chat</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this chat? This action cannot be undone.</p>
              <div className="delete-confirmation-buttons">
                <button className="modal-btn secondary" onClick={cancelDeleteChat}>
                  Cancel
                </button>
                <button className="modal-btn danger" onClick={confirmDeleteChat}>
                  <i className="bi bi-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay visible">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowLoginModal(false)}>&times;</button>
            <div className="modal-header">
              <h3>You've reached the message limit</h3>
            </div>
            <div className="modal-body">
              <p>Please log in or sign up to continue the conversation and access all features.</p>
              <div className="login-buttons">
                <button className="modal-btn primary">Login</button>
                <button className="modal-btn secondary">Sign Up</button>
                <div className="separator">OR</div>
                <button className="modal-btn google"><i className="bi bi-google"></i> Login with Google</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal; 