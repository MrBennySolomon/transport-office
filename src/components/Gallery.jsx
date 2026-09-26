import React from "react";
import siteConfig from "../data/siteConfig";

export default function Gallery() {
  const { gallery } = siteConfig;
  return (
    <section className="section gallery-section">
      <div className="container">
        <div className="section-heading light-heading">
          <span className="eyebrow">הצי שלנו</span>
          <h2>{gallery.title}</h2>
          <p>פתרונות שינוע שמתאימים למטען, לדרך וללוח הזמנים שלכם.</p>
        </div>
        <div className="gallery-grid">
          {gallery.images.map((src, i) => <img key={src} src={src} alt={`משאית הובלה ${i + 1}`} loading="lazy" />)}
        </div>
      </div>
    </section>
  );
}
