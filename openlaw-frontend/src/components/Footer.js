import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <img src="allwhite.svg" alt="OpenLaw Logo" style={{ height: '40px' }} className="mb-3" />
              <p>100 Pine St, Suite 1250<br />San Francisco, CA 94111</p>
              <div className="social-icons">
                <a href="https://www.facebook.com/share/1Biw2iFTES/"><i className="bi bi-facebook"></i></a>
                <a href="https://x.com/getopenlaw?s=21&t=703FXryyp1oKcBMorzdgSQ"><i className="bi bi-twitter-x"></i></a>
                <a href="https://www.linkedin.com/company/getopenlaw"><i className="bi bi-linkedin"></i></a>
                <a href="https://www.tiktok.com/@openlaw?_t=ZP-8wxF6VTwggg&_r=1"><i className="bi bi-tiktok"></i></a>
                <a href="https://www.instagram.com/openlawhq?igsh=dmFmOXZtcm9sYXRu"><i className="bi bi-instagram"></i></a>
              </div>
              <p className="mt-3">&copy; OpenLaw 2025</p>
            </div>
            <div className="col-lg-2 col-md-4 col-6 mb-4 mb-lg-0">
              <h5>Navigation</h5>
              <ul className="list-unstyled">
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#comparison">Comparison</a></li>
                <li><a href="https://www.openlaw.com/usabout">About Us</a></li>
                <li><a href="https://www.openlaw.com/attorneys">Attorneys</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4 col-6 mb-4 mb-lg-0">
              <h5>Contact</h5>
              <ul className="list-unstyled">
                <li><a href="#">Press</a></li>
                <li><a href="mailto:info@getopenlaw.com">info@getopenlaw.com</a></li>
                <li><a href="tel:844-705-4448">844-705-4448</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-4 col-12">
              <h5>Resources</h5>
              <ul className="list-unstyled">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <hr />
          <div className="footer-disclaimer">
            <p>OpenLaw is a dynamic online platform designed to streamline the process of connecting individuals and businesses with legal professionals tailored to their specific needs. While we are not a law firm, nor do we offer legal services, legal advice, or "lawyer referral services," our platform facilitates efficient access to qualified legal assistance without directly participating in any legal representation.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 