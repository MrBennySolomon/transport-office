import React from "react";
import { CheckCircle2, Users, Route, Clock3 } from "lucide-react";
import siteConfig from "../data/siteConfig";

const ICONS = { route: Route, users: Users, check: CheckCircle2, clock: Clock3 };

export default function About() {
  const { about } = siteConfig;
  return (
    <main>
      <section className="page-hero"><div className="container"><span className="eyebrow">{about.heroEyebrow}</span><h1>{about.heroTitle}</h1></div></section>
      <section className="section about-section">
        <div className="container about-grid">
          <div>
            <span className="eyebrow dark">{about.sectionEyebrow}</span>
            <h2>{about.sectionTitle}</h2>
            {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="about-cards">
            {about.cards.map((card) => {
              const Icon = ICONS[card.icon] || CheckCircle2;
              return <div key={card.title}><Icon /><b>{card.title}</b><span>{card.text}</span></div>;
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
