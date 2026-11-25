import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="container-x profile-spread">
      <figure className="profile-figure" data-reveal>
        <div className="profile-photo">
          <Image src="/hadi-portrait.webp" alt="Muhammad Hadi" width={640} height={800} sizes="(max-width: 700px) 85vw, 32vw" />
        </div>
        <figcaption>Muhammad Hadi <span>Developer</span></figcaption>
      </figure>
      <div data-reveal>
        <p className="folio-label">About me</p>
        <h2 className="editorial-title">From a first idea<br />to a <em>live product.</em></h2>
        <p className="editorial-copy">I’m Muhammad Hadi. I use AI-assisted coding to explore ideas, then work through the code, interface and deployment myself.</p>
        <p className="editorial-copy">My day-to-day work spans technical SEO, GitHub and the command line. I care as much about how a site gets found and maintained as how it feels to use.</p>
        <a className="folio-link" href="https://github.com/mhadiglobel-bot" target="_blank" rel="noopener noreferrer">Find me on GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
