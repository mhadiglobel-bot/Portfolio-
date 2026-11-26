import RollingText from "./RollingText";

export default function About() {
  return <section id="about" className="portrait-scene" aria-labelledby="portrait-heading">
    <div className="portrait-light" aria-hidden="true"><img src="/hadi-cutout.webp" alt="" width="1199" height="1312" loading="lazy" /></div>
    <div className="container-x portrait-copy">
      <p className="folio-label">About Muhammad Hadi</p>
      <h2 id="portrait-heading"><RollingText>From a first idea</RollingText><br/><em><RollingText>to a live product.</RollingText></em></h2>
      <p>I use AI-assisted coding to explore an idea, then build the interface, work through the code and take it live.</p>
      <p>My day-to-day tools are GitHub, the command line and technical SEO. I care about how a site feels, how people find it and how it holds up after launch.</p>
      <a className="folio-link" href="https://github.com/mhadiglobel-bot">Find me on GitHub <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
