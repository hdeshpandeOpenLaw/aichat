import React, { useState } from 'react';

const HeroSection = ({ onOpenChat }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search form submitted with query:', searchQuery);
    if (searchQuery.trim()) {
      onOpenChat(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion button clicked:', suggestion);
    onOpenChat(suggestion);
  };

  console.log('HeroSection render - onOpenChat function:', typeof onOpenChat);

  return (
    <section className="hero-section text-white text-center">
      <div className="container">
        <h1>You deserve the best representation</h1>
        <p className="lead">
          People who use OpenLaw generally save <a href="#savings" className="text-white">between 30 to 70%</a> on legal fees.
        </p>
        
        <div className="search-bar-container mt-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <i className="bi bi-stars search-icon"></i>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                placeholder="What can we help with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="suggestion-buttons mt-3">
          <button 
            className="btn btn-light"
            onClick={() => handleSuggestionClick("Need to understand a legal document")}
          >
            <i className="bi bi-file-text icon-legal-doc"></i> Need to understand a legal document
          </button>
          <button 
            className="btn btn-light"
            onClick={() => handleSuggestionClick("Need a lawyer to defend me")}
          >
            <i className="bi bi-shield-check icon-defend"></i> Need a lawyer to defend me
          </button>
          <button 
            className="btn btn-light"
            onClick={() => handleSuggestionClick("Draft a contract or agreement")}
          >
            <i className="bi bi-pencil-square icon-draft"></i> Draft a contract or agreement
          </button>
          <button 
            className="btn btn-light"
            onClick={() => handleSuggestionClick("Received a letter from OpenLaw")}
          >
            <i className="bi bi-envelope icon-letter"></i> Received a letter from OpenLaw
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 