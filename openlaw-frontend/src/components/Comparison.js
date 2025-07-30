import React from 'react';

const Comparison = () => {
  return (
    <section id="comparison" className="comparison-section py-5">
      <div className="container text-center">
        <h2 className="fw-bold text-white">OpenLaw vs. The Traditional Way</h2>
        <img 
          src="https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/673b00fccbeb5118a11c4146_Content.svg" 
          alt="Comparison Chart" 
          className="img-fluid mt-5 comparison-desktop" 
        />
        <img 
          src="https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/673fda7465cc06fc2552c236_Group%2057.svg" 
          alt="Comparison Chart Mobile" 
          className="img-fluid mt-5 comparison-mobile" 
        />
      </div>
    </section>
  );
};

export default Comparison; 