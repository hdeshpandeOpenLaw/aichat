import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ChatModal from './components/ChatModal';
import AttorneyDirectory from './components/AttorneyDirectory';
import PracticeAreas from './components/PracticeAreas';
import HowItWorks from './components/HowItWorks';
import Comparison from './components/Comparison';
import FAQ from './components/FAQ';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  // Detect mobile
  const isMobile = window.innerWidth <= 767;

  const handleOpenChat = (query = '') => {
    setInitialQuery(query);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setInitialQuery('');
  };

  return (
    <div className="App">
      <Header />
      <HeroSection onOpenChat={handleOpenChat} />
      <AttorneyDirectory />
      <PracticeAreas />
      <HowItWorks />
      <Comparison />
      <FAQ />
      <FooterCTA />
      <Footer />
      {/* Only show ChatModal when isChatOpen is true */}
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          initialQuery={initialQuery}
        />
      )}
    </div>
  );
}

export default App;
