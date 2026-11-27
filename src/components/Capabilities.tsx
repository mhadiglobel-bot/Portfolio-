import RollingText from "./RollingText";
import SectionLabel from "./SectionLabel";

const skillGroups = [
  {
    number: "01",
    title: "Web development",
    skills: [
      "Website and web app development",
      "Responsive frontend interfaces",
      "UI/UX implementation",
    ],
  },
  {
    number: "02",
    title: "AI & ChatGPT",
    skills: [
      "ChatGPT-assisted development",
      "AI product and API workflows",
      "Workflow automation",
    ],
  },
  {
    number: "03",
    title: "Data & deployment",
    skills: [
      "Database management",
      "GitHub repository management",
      "Vercel deployment",
    ],
  },
  {
    number: "04",
    title: "SEO & optimisation",
    skills: [
      "Technical SEO",
      "On-page SEO",
      "Website performance",
    ],
  },
];

export default function Capabilities() {
  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-heading">
      <div className="container-x">
        <div data-reveal>
          <SectionLabel index="04">Skills</SectionLabel>
          <h2 id="skills-heading" className="skills-heading">
            Skills &amp; <em><RollingText>tools.</RollingText></em>
          </h2>
        </div>

        <div className="skills-grid" data-reveal-stagger>
          {skillGroups.map((group) => (
            <article className="skill-group" key={group.number}>
              <span className="skill-number">{group.number}</span>
              <h3>{group.title}</h3>
              <ul>
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
