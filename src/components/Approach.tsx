import RollingText from "./RollingText";
import SectionLabel from "./SectionLabel";

const steps = [
  {
    number: "01",
    title: "Start with the feeling.",
    text: "Understand what the experience should feel like before deciding how it should look. Clarity first, decoration last.",
    tag: "Intention before interface",
  },
  {
    number: "02",
    title: "Make complexity feel simple.",
    text: "Thoughtful structure and careful engineering let people focus on what they came to do, not on how the product works.",
    tag: "Less friction, more flow",
  },
  {
    number: "03",
    title: "Give every movement meaning.",
    text: "Motion should guide attention, explain change and add character. It should never make the experience harder to use.",
    tag: "Motion with a purpose",
  },
];

export default function Approach() {
  return (
    <section id="approach" className="relative py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <SectionLabel index="05">The way I think</SectionLabel>
          <h2 className="display-lg font-display mt-8 max-w-md text-white">
            Good work lives in the{" "}
            <span className="serif-i gradient-text">details.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
            Not more effects. Better decisions. Every part should have a reason to be
            there.
          </p>
          <div className="mt-10 hidden lg:block">
            <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
              Made with intention
              <span className="text-pink">✳</span>
            </div>
          </div>
        </div>

        <div className="space-y-4" data-reveal-stagger>
          {steps.map((step) => (
            <article
              key={step.number}
              className="glass group relative overflow-hidden rounded-3xl p-6 transition-colors duration-500 hover:bg-white/[0.06] sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-7">
                <span className="gradient-text font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl">
                  {step.number}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
                    <RollingText>{step.title}</RollingText>
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/45">
                    {step.text}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-white/30">
                    <span className="h-px w-6 bg-gradient-to-r from-pink to-purple" />
                    {step.tag}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
