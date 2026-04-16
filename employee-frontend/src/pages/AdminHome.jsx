import Navbar from "../components/Navbar";

const featureGroups = [
  {
    title: "Daily oversight",
    description: "See who is active, who is drifting, and where the team's time is going.",
  },
  {
    title: "Incident review",
    description: "Open suspicious snapshots with reason tags and timestamps in one place.",
  },
  {
    title: "People management",
    description: "Create employee accounts, review individual usage, and reach out quickly.",
  },
];

const workflowSteps = [
  "Desktop tracker records activity and idle time.",
  "Backend stores events and processed snapshots.",
  "Admin dashboard turns raw data into clear summaries.",
  "Managers can act on trends without digging through logs.",
];

const stackItems = [
  "React dashboard",
  "Node and Express API",
  "MongoDB storage",
  "Python tracker",
  "OpenCV checks",
  "Cloud image uploads",
];

export default function AdminHome() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-wrap space-y-8">
        <section className="surface-card overflow-hidden !p-0">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-7 sm:p-10">
              <span className="eyebrow">Admin Overview</span>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-[#1d2b28] sm:text-5xl">
                Built for teams that want clean visibility, not dashboard noise.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
                WorkTrack helps you monitor daily productivity, review incidents,
                and understand employee engagement through a calm, practical admin
                workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="pill">Activity logs</span>
                <span className="pill">Focus scoring</span>
                <span className="pill">Incident snapshots</span>
                <span className="pill">Employee directory</span>
              </div>
            </div>

            <div className="border-t border-[rgba(83,61,39,0.08)] bg-[#1f3a33] p-7 text-white lg:border-l lg:border-t-0 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e9c99d]">
                What this console gives you
              </p>
              <div className="mt-6 space-y-4">
                {featureGroups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-[24px] border border-white/10 bg-white/8 p-4"
                  >
                    <h2 className="text-lg font-bold">{group.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-200">
                      {group.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-card">
            <span className="eyebrow">Workflow</span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-900">
              How the system flows
            </h2>
            <div className="mt-6 space-y-4">
              {workflowSteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-[22px] bg-[#f8f3eb] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f3a33] text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-stone-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card">
            <span className="eyebrow">Coverage</span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-900">
              The essentials are already in place
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stackItems.map((item) => (
                <div key={item} className="subtle-card text-center">
                  <p className="text-base font-bold tracking-tight text-stone-900">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-[rgba(83,61,39,0.08)] bg-white/70 p-5">
              <p className="text-sm leading-6 text-stone-600">
                The interface is intentionally restrained so that information
                remains easy to scan. The focus is on readability, structure,
                and day-to-day usability rather than decorative effects.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
