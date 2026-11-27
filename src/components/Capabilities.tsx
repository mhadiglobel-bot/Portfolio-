import styles from "./PortfolioSections.module.css";

const disciplines = [
  ["Web development", "I build responsive websites with layouts that work across small screens, wide monitors and keyboard navigation."],
  ["UI & UX design", "I map user journeys, shape the visual hierarchy and prototype interactions before moving into code."],
  ["Backend programming", "I write the APIs, authentication checks and application logic behind forms, dashboards and product workflows."],
  ["Database management", "I structure records, write queries and plan schema changes as a product grows."],
  ["AI integration & chatbots", "I connect models to websites and tune chatbot prompts and conversation flows around real customer questions."],
  ["AI-assisted development", "I prototype with coding assistants, review their output and test edge cases before release."],
  ["Version control & deployment", "I manage Git branches, review changes on GitHub and use preview builds to check releases before publishing."],
  ["Hosting & maintenance", "I configure domains and hosting, investigate errors through logs and keep live sites running after launch."],
  ["Technical SEO", "I improve crawlability, indexing, metadata and page performance, then monitor how pages appear in search."],
];

export default function Capabilities() {
  return <section id="expertise" className={`container-x ${styles.section}`} aria-labelledby="expertise-heading">
    <header className={styles.heading}><h2 id="expertise-heading">Technical <em>expertise.</em></h2></header>
    <dl className={styles.disciplines}>{disciplines.map(([title,description]) =>
      <div key={title}><dt>{title}</dt><dd>{description}</dd></div>
    )}</dl>
  </section>;
}
