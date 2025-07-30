import React, { useState } from 'react';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleToggle = () => setIsNavOpen((open) => !open);
  const handleNavLinkClick = () => setIsNavOpen(false);

  return (
    <header className="container-fluid">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src="/allwhite.svg" alt="OpenLaw Logo" style={{ height: '40px' }} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
            onClick={handleToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse${isNavOpen ? ' show' : ''}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works" onClick={handleNavLinkClick}>How It Works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#comparison" onClick={handleNavLinkClick}>Comparison</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://app.openlaw.com/search" onClick={handleNavLinkClick}>Attorney Directory</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://www.openlaw.com/attorneys" onClick={handleNavLinkClick}>Attorneys</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#espanol" onClick={handleNavLinkClick}>Español</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="tel:844-705-4448" onClick={handleNavLinkClick}>
                  <i className="bi bi-telephone-fill"></i> 844-705-4448
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 