import React from 'react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="how-it-works-section py-5">
      <div className="container text-center">
        <h2 className="fw-bold">Save up to 70% on Attorney Marketplace™</h2>
        <p className="lead text-muted mb-5">Post one request and have in-network vetted attorneys come to you</p>
        <div className="row">
          <div className="col-md-4">
            <div className="how-it-works-card">
              <h3>1. Submit Your Case</h3>
              <p>Quickly share your case details.</p>
              <div className="card-visual">
                <p className="visual-text">To get started, could you briefly tell us what's going on?</p>
                <div className="visual-line"></div>
                <div className="visual-line short"></div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="how-it-works-card">
              <h3>2. Compare Proposals</h3>
              <p>Match with experienced attorneys for your needs.</p>
              <div className="card-visual">
                <div className="proposal">
                  <div className="proposal-attorney">
                    <img src="https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/68040913ebd77b444f05d6b6_image.png" alt="Andrew G." />
                    <div className="proposal-details">
                      <div>
                        <strong>Andrew G.</strong>
                        <span>38 years of experience</span>
                      </div>
                      <div className="proposal-price">$1,500</div>
                    </div>
                  </div>
                </div>
                <div className="proposal">
                  <div className="proposal-attorney">
                    <img src="https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/6829a2bea4438778adf41516_image.png" alt="Allison W." />
                    <div className="proposal-details">
                      <div>
                        <strong>Allison W.</strong>
                        <span>18 years of experience</span>
                      </div>
                      <div className="proposal-price">$950</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="how-it-works-card">
              <h3>3. Choose Attorney</h3>
              <p>Select your ideal attorney and proceed confidently.</p>
              <div className="card-visual">
                <div className="proposal selected">
                  <div className="proposal-attorney">
                    <img src="https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/68040913ebd77b444f05d6b6_image.png" alt="Andrew G." />
                    <div>
                      <strong>Andrew G.</strong>
                      <span>38 years of experience</span>
                    </div>
                  </div>
                </div>
                <button className="btn btn-success w-100 mt-3">
                  <i className="bi bi-check-circle-fill"></i> Hired
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href="https://app.openlaw.com/request" className="btn btn-primary btn-lg mt-5">Post A Request And Hire An Attorney</a>
      </div>
    </section>
  );
};

export default HowItWorks; 