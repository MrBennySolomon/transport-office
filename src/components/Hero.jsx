import React from "react";
import { ArrowLeft, CheckCircle2, Phone, Truck } from "lucide-react";
import siteConfig from "../data/siteConfig";

export default function Hero() {
  const { hero, brand } = siteConfig;

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-badge"><Truck size={16} /> משרד הובלה ושינוע</div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.titleLine1}<br /><span>{hero.titleSpan}</span></h1>
          <p>{hero.text}</p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">{hero.ctaPrimaryText} <ArrowLeft size={18} /></a>
            <a href={`tel:${brand.phoneHref}`} className="btn btn-ghost"><Phone size={18} /> {hero.ctaSecondaryText}</a>
          </div>
          <div className="hero-points">
            {hero.points.map((point) => <span key={point}><CheckCircle2 size={17} /> {point}</span>)}
          </div>
        </div>
      </div>
      <div className="hero-truck-card">
        <span>זמינות ותיאום</span>
        <b>הובלה שמתאימה ללוח הזמנים שלכם</b>
      </div>
    </section>
  );
}
