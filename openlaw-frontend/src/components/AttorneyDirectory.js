import React from 'react';

const AttorneyDirectory = () => {
  const attorneys = [
    {
      id: 1,
      name: "Jeremy Roth, Esq.",
      rating: "5.00",
      reviews: 8,
      license: "Florida",
      specialty: "Civil Litigation, Business Disputes",
      image: "https://cdn.prod.website-files.com/643469e2e1dbbd0d488eebb1/681e3f190f75dbd75509bb97_avatars%252FTdiIifdJpu5PhZBTr2oh.webp",
      profile: "https://app.openlaw.com/profile/Jeremy-Roth-VGRpSWl"
    },
    {
      id: 2,
      name: "Lissette Eusebio, Esq.",
      rating: "5",
      reviews: 14,
      license: "Florida",
      specialty: "Startup Law, Immigration Law, Personal Injury, Family Petitions",
      image: "https://cdn.prod.website-files.com/643469e2e1dbbd0d488eebb1/681e3f8ab9b547cf7bd591c7_avatars%252Fu9fuO9StMj4D5s0zfGrX.webp",
      profile: "https://app.openlaw.com/profile/Lissette-Eusebio-dTlmdU8"
    },
    {
      id: 3,
      name: "Caridad Cangas, Esq.",
      rating: "5.00",
      reviews: 19,
      license: "Florida",
      specialty: "Contract Disputes, Will, Trusts",
      image: "https://cdn.prod.website-files.com/643469e2e1dbbd0d488eebb1/681e3e4c0b5b1eb33341521f_avatars%252FoNRj2CpnfU1LIID1vMun.webp",
      profile: "https://app.openlaw.com/profile/Caridad-Cangas-b05SajJ"
    }
  ];

  return (
    <section className="attorney-directory py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Browse our Attorney Directory™</h2>
            <p className="text-muted">OpenLaw is the easiest way to connect with the attorney of your choice</p>
          </div>
          <div>
            <a href="https://app.openlaw.com/search" className="view-more">View More</a>
            <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-chevron-left"></i></button>
            <button className="btn btn-outline-secondary btn-sm"><i className="bi bi-chevron-right"></i></button>
          </div>
        </div>
        <div className="row">
          {attorneys.map((attorney) => (
            <div key={attorney.id} className="col-md-4 mb-4">
              <div className="card attorney-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img src={attorney.image} className="rounded-circle" alt={attorney.name} />
                    <div className="ms-3">
                      <h5 className="card-title mb-0">
                        {attorney.name} <i className="bi bi-check-circle-fill text-success"></i>
                      </h5>
                      <p className="mb-0 text-muted">
                        <i className="bi bi-star-fill text-warning"></i> {attorney.rating} • {attorney.reviews} reviews
                      </p>
                    </div>
                  </div>
                  <p><i className="bi bi-geo-alt"></i> Licensed in: {attorney.license}</p>
                  <p><i className="bi bi-briefcase"></i> Experienced in: {attorney.specialty}</p>
                  <p className="text-muted small">Accepting new clients • Free consultation</p>
                  <p className="mt-3">Next available today</p>
                  <a href={attorney.profile || `https://app.openlaw.com/attorney/${attorney.id}`} className="btn btn-primary w-100 book-now-btn" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-lightning-fill"></i> Book Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttorneyDirectory; 