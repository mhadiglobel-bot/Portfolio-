export default function Contact() {
  return (
    <section id="contact" className="contact-spread">
      <div className="container-x contact-inner" data-reveal>
        <p className="folio-label">Get in touch</p>
        <h2 className="editorial-title">What are you<br /><em>working on?</em></h2>
        <p className="editorial-copy">Tell me about the product, the people using it, and where you want to take it next.</p>
        <a href="mailto:mhadi.globel@gmail.com" className="contact-card" aria-label="Email Muhammad Hadi at mhadi.globel@gmail.com">
          <span className="contact-card__details">
            <span className="contact-card__eyebrow"><i aria-hidden="true" /> DIRECT EMAIL</span>
            <span className="contact-card__email">mhadi.globel@gmail.com</span>
            <span className="contact-card__hint">Start a conversation</span>
          </span>
          <span className="contact-card__action" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 19 19 5M7 5h12v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
