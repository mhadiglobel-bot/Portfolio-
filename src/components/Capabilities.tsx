import RollingText from "./RollingText";
import SectionLabel from "./SectionLabel";

const skills = [
  {
    number: "01",
    domain: "Development",
    title: "Web Development",
    description:
      "Building complete websites and web applications, from responsive interfaces to the logic that powers them.",
    areas: [
      "Full-stack website development",
      "Frontend and backend development",
      "Responsive web applications",
    ],
  },
  {
    number: "02",
    domain: "Experience",
    title: "UI/UX Design",
    description:
      "Turning complex ideas into clear, intuitive experiences with considered layouts and purposeful interactions.",
    areas: [
      "User interface design",
      "User experience and user flows",
      "Interaction and visual design",
    ],
  },
  {
    number: "03",
    domain: "Intelligence",
    title: "AI Integration",
    description:
      "Adding practical AI capabilities to products, tools and business workflows through modern AI services.",
    areas: [
      "AI and LLM API integration",
      "AI-powered product features",
      "Intelligent workflow automation",
    ],
  },
  {
    number: "04",
    domain: "Application systems",
    title: "Backend & Databases",
    description:
      "Designing the application logic and data structures that keep digital products reliable and connected.",
    areas: [
      "Database design and management",
      "API development and integration",
      "Authentication and data modelling",
    ],
  },
  {
    number: "05",
    domain: "Discoverability",
    title: "SEO & Performance",
    description:
      "Making websites easier to discover, faster to use and technically sound across devices and search engines.",
    areas: [
      "Technical and on-page SEO",
      "Core Web Vitals optimisation",
      "Website speed and performance",
    ],
  },
];

export default function Capabilities() {
  return (
    <section
      id="skills"
      className="skills-section"
      aria-labelledby="skills-heading"
    >
      <div className="container-x">
        <div data-reveal>
          <SectionLabel index="04">Core capabilities</SectionLabel>
          <h2 id="skills-heading" className="skills-heading">
            Skills &amp; <em><RollingText>expertise.</RollingText></em>
          </h2>
          <p className="skills-intro">
            The practical disciplines I bring together to plan, design and build
            digital products.
          </p>
        </div>

        <div className="skills-grid" data-reveal-stagger>
          {skills.map((skill) => (
            <article className="skill-card" key={skill.number}>
              <div className="skill-card-top">
                <span className="skill-number">{skill.number}</span>
                <span className="skill-domain">{skill.domain}</span>
              </div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <ul>
                {skill.areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
