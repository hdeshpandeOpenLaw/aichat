import React from 'react';

const FooterCTA = () => {
  return (
    <div className="footer-cta py-5">
      <div className="container">
        <div className="card p-5 text-center">
          <h2 className="fw-bold">What type of legal help do you need?</h2>
          <div className="row mt-4">
            <div className="col-md-4">
              <a href="https://staging.openlaw.com/en/client/intake/representation" className="cta-card-link">
                <div className="cta-card">
                  <div>
                    <h5>Case Representation</h5>
                    <p>Find the right lawyer to handle your legal needs.</p>
                  </div>
                  <i className="bi bi-scales"></i>
                </div>
              </a>
            </div>
            <div className="col-md-4">
              <a href="https://staging.openlaw.com/en/client/intake/case" className="cta-card-link">
                <div className="cta-card">
                  <div>
                    <h5>File a New Case</h5>
                    <p>Easily start a new case through our platform.</p>
                  </div>
                  <i className="bi bi-bank2"></i>
                </div>
              </a>
            </div>
            <div className="col-md-4">
              <a href="https://staging.openlaw.com/en/client/intake/draft" className="cta-card-link">
                <div className="cta-card">
                  <div>
                    <h5>Draft Documents</h5>
                    <p>Get expert answers to your legal questions.</p>
                  </div>
                  <i className="bi bi-file-earmark-text"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCTA; 