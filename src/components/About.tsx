import RollingText from "./RollingText";

export default function About() {
  return <section id="about" className="portrait-scene" aria-labelledby="portrait-heading">
    <div className="portrait-light" aria-hidden="true"><img src="/hadi-cutout.webp" alt="" width="1199" height="1312" loading="lazy" /></div>
    <div className="container-x portrait-copy">
      <p className="folio-label">About Muhammad Hadi</p>
      <h2 id="portrait-heading"><RollingText>From a first idea</RollingText><br/><em><RollingText>to a live product.</RollingText></em></h2>
      <p>I’m Muhammad Hadi, an independent web developer. My work ranges from Audixo, where people record and edit audio in their browser, to Rank Ur Business, where they search for a business by name, category or location.</p>
      <p>I use AI-assisted coding to try out an idea, then work through the details myself. I build the interface, test it on a phone and use GitHub and the command line to ship it. Technical SEO is part of that work too. A page should be easy to find as well as easy to use.</p>
      <a className="folio-link" href="https://github.com/mhadiglobel-bot">Find me on GitHub <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
