import SectionLabel from "./SectionLabel";

export default function Statement() {
  return (
    <section id="statement" className="relative py-24 md:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[680px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/8 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-x relative">
        <div data-reveal>
          <SectionLabel index="01">The point of the work</SectionLabel>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-end">
          <h2 className="display-lg font-display max-w-3xl text-balance text-white" data-reveal>
            The best digital experiences don&apos;t just work beautifully.{" "}
            <span className="text-white/35">They make you feel something.</span>
          </h2>
          <p
            className="max-w-md text-sm leading-7 text-white/45 lg:pb-2 lg:pl-6"
            data-reveal
          >
            The first impression matters. So do the small interactions, the structure
            underneath, and the moment everything comes together.
          </p>
        </div>
      </div>
    </section>
  );
}
