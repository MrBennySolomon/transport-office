import React from "react";
import { Truck, Warehouse, Construction, Route, Package, Clock3 } from "lucide-react";
import siteConfig from "../data/siteConfig";

const ICONS = { truck: Truck, warehouse: Warehouse, construction: Construction, route: Route, package: Package, clock: Clock3 };

export default function Services({ preview = false }) {
  const { services } = siteConfig;
  const list = preview ? services.list.slice(0, 3) : services.list;

  return (
    <section className="section services-section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow dark">{services.eyebrow}</span>
          <h2>{services.title}</h2>
          <p>{services.subtitle}</p>
        </div>
        <div className="service-grid">
          {list.map((service) => {
            const Icon = ICONS[service.icon] || Truck;
            return (
              <article className="service-card" key={service.title}>
                <div className="service-icon"><Icon /></div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
