import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="signature">
      <div className="signature-stage container-x">
        <div className="signature-type">
          <p className="folio-label">Independent developer &amp; product engineer</p>
          <h1>Muhammad<br /><em>Hadi.</em></h1>
          <p className="signature-bio">I build web products, shape how they move, and help people find them through search.</p>
          <a className="folio-link" href="#work">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
        <div className="emblem-plate" aria-hidden="true">
          <div className="emblem-halo" />
          <Image src="/mh-emblem.webp" alt="" width={1254} height={1254} sizes="(max-width: 700px) 48vw, 32vw" loading="eager" />
        </div>
      </div>
    </section>
  );
}
