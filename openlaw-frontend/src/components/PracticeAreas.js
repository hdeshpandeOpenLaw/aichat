import React from 'react';

const PracticeAreas = () => {
  const practiceAreas = [
    {
      name: "Civil Law",
      icon: "https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/6803fcb6c66687434a820bdf__Categoy%20icon.png",
      link: "https://app.openlaw.com/search?specialties=Civil+Litigation"
    },
    {
      name: "Family Law",
      icon: "https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/6803fde5e35aa63e473fd916_j_Categoy%20icon.png",
      link: "https://app.openlaw.com/search?specialties=Family+Law"
    },
    {
      name: "Debt Case",
      icon: "https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/6803fde5a7249cb757882147_kk_Categoy%20icon.png",
      link: "https://app.openlaw.com/search?specialties=Debt+Relief"
    },
    {
      name: "Criminal",
      icon: "https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/6803fde5925d3d7261471b50_o_Categoy%20icon.png",
      link: "https://app.openlaw.com/search?specialties=Criminal+Law"
    },
    {
      name: "Immigration",
      icon: "https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/6803fde578c9a55db18fd5fb_p_Categoy%20icon.png",
      link: "https://app.openlaw.com/search?specialties=Immigration+Law"
    },
    {
      name: "And more soon!",
      icon: "https://cdn.prod.website-files.com/63fc6a313efb7221d65ab665/684307aab8b052beb56971cb__Categoy%20icon.svg",
      link: "https://app.openlaw.com/search"
    }
  ];

  return (
    <section className="practice-areas-section py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-5">Top-searched practice areas</h2>
        <div className="row justify-content-center">
          {practiceAreas.map((area, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-2 mb-4">
              <a href={area.link} className="practice-area-link">
                <div className="practice-area-card">
                  <img src={area.icon} alt={`${area.name} Icon`} />
                  <p className="mt-3">{area.name} <i className="bi bi-chevron-right"></i></p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas; 