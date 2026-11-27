import RollingText from "./RollingText";

const disciplines = [
  ["Full-stack web development", "I build responsive interfaces and the backend APIs, database queries and authentication flows that power them."],
  ["AI integration & chatbots", "I connect AI models to product workflows, manage chatbot conversations and tune prompts around the questions people actually ask."],
  ["UI & UX design", "I map the path from the first screen to the final action, then design layouts, navigation and interactions for desktop and mobile."],
  ["AI-assisted development", "I use vibe coding to explore an idea quickly, then review the generated code, test edge cases and refine it for production."],
  ["Version control & deployment", "I use Git and GitHub to track changes, review branches and ship tested releases through preview and production environments."],
  ["Hosting & maintenance", "I manage hosting accounts, domains and configuration, trace errors through logs and maintain sites after launch."],
];

export default function Capabilities() {
  return <section id="expertise" className="expertise container-x" aria-labelledby="expertise-heading">
    <h2 id="expertise-heading"><RollingText>Technical</RollingText><br/><em><RollingText>expertise.</RollingText></em></h2>
    <dl>{disciplines.map(([title, description]) =>
      <div key={title}><dt>{title}</dt><dd>{description}</dd></div>
    )}</dl>
  </section>;
}
