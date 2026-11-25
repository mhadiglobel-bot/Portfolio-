import RollingText from "./RollingText";

export default function Contact() {
  return <section id="contact" className="letterpress">
    <div className="container-x">
      <p className="folio-label">Get in touch</p>
      <h2><RollingText>What are you</RollingText><br/><em><RollingText>working on?</RollingText></em></h2>
      <p>Tell me about the product and the people you’re building it for.</p>
      <a className="mail-line" href="mailto:mhadi.globel@gmail.com"><RollingText>mhadi.globel@gmail.com</RollingText><span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
