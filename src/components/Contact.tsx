import RollingText from "./RollingText";

export default function Contact() {
  return <section id="contact" className="letterpress">
    <div className="container-x">
      <p className="folio-label">Get in touch</p>
      <h2><RollingText>What are you</RollingText><br/><em><RollingText>working on?</RollingText></em></h2>
      <p>Tell me about the product and the people you’re building it for.</p>
      <a className="mail-line" href="mailto:mhadi.globel@gmail.com"><RollingText>mhadi.globel@gmail.com</RollingText><span className="mail-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><g className="mail-envelope"><rect x="8" y="13" width="32" height="23" rx="3"/><path d="m9 15 15 11 15-11"/></g><path className="mail-plane" d="m7 24 34-16-10 33-7-13-17-4Zm17 4L41 8"/></svg></span></a><a className="contact-github" href="https://github.com/mhadiglobel-bot">GitHub profile ↗</a>
    </div>
  </section>;
}
