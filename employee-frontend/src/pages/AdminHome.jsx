import Navbar from "../components/Navbar";

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">

        {/* HERO */}
        <section className="text-center space-y-6">

          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-transparent bg-clip-text animate-pulse">
            Smart Employee Tracking & Productivity Intelligence
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            An AI-powered monitoring ecosystem that captures real-time activity,
            detects fake engagement, verifies identity using computer vision,
            and transforms raw behavioral data into actionable performance insights.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Badge text="AI Monitoring" />
            <Badge text="Real-time Analytics" />
            <Badge text="Face Detection" />
            <Badge text="Productivity Scoring" />
          </div>

        </section>

        {/* PROBLEM → SOLUTION */}
        <section className="grid md:grid-cols-2 gap-10 items-center">

          <div className="space-y-4">
            <h2 className="title">🎯 The Problem</h2>
            <p className="text-gray-600 leading-relaxed">
              In remote and hybrid work environments, traditional attendance systems fail
              to measure actual productivity. Employees can simulate activity using fake
              mouse movement, unauthorized users can operate systems, and managers lack
              real-time visibility into performance.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-3">💡 Our Solution</h2>
            <p className="leading-relaxed">
              A Python-powered intelligent desktop agent continuously monitors activity,
              detects idle states, prevents fake engagement patterns, performs periodic
              facial verification, and sends structured productivity data to a MERN
              analytics dashboard for real-time decision making.
            </p>
          </div>

        </section>

        {/* CORE FEATURES */}
        <section>
          <h2 className="title text-center"> <span className="solid border-b-2 pb-1 " >
            ⚡ Core Features
            </span></h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <FeatureCard
              title="Real-Time Activity Tracking"
              desc="Tracks active time, idle duration, and passive behavior using low-level system event monitoring."
            />

            <FeatureCard
              title="Fake Mouse Movement Detection"
              desc="Detects confined repetitive motion patterns to prevent analog watch or scripted activity fraud."
            />

            <FeatureCard
              title="Application Intelligence"
              desc="Classifies software into productive, neutral, and distracting categories to compute focus score."
            />

            <FeatureCard
              title="AI Face Verification"
              desc="Captures periodic snapshots and detects unauthorized users using OpenCV face comparison."
            />

            <FeatureCard
              title="Incident Management"
              desc="Automatically uploads suspicious activity images to Cloudinary and alerts the admin."
            />

            <FeatureCard
              title="Admin Analytics Dashboard"
              desc="Leaderboard, performance scoring, email communication, and workforce insights."
            />

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <h2 className="title text-center">  <span className="solid border-b-2 pb-1 " >⚙ System Workflow</span> </h2>

          <div className="grid md:grid-cols-4 gap-6 mt-8 text-center">

            <Step title="Python Agent" />
            <Step title="Node API" />
            <Step title="MongoDB Storage" />
            <Step title="React Dashboard" />

          </div>
        </section>

        {/* TECH STACK */}
        <section>
          <h2 className="title text-center"> <span className="solid border-b-2 pb-1 " >🛠 Technology Stack</span> </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

            <TechCard name="React" color="from-cyan-400 to-blue-500" />
            <TechCard name="Node.js" color="from-green-400 to-emerald-500" />
            <TechCard name="MongoDB" color="from-lime-400 to-green-600" />
            <TechCard name="Express" color="from-gray-400 to-gray-600" />
            <TechCard name="Python" color="from-yellow-400 to-orange-500" />
            <TechCard name="OpenCV" color="from-pink-400 to-red-500" />
            <TechCard name="Cloudinary" color="from-indigo-400 to-purple-500" />
            <TechCard name="JWT Auth" color="from-orange-400 to-red-500" />

          </div>
        </section>

        {/* FUTURE SCOPE */}
        <section>
          <h2 className="title text-center"> <span className="solid border-b-2 pb-1 " > 🔮 Future Roadmap</span> </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <FutureCard text="AI productivity prediction engine" />
            <FutureCard text="Real-time WebSocket monitoring" />
            <FutureCard text="Department level analytics" />
            <FutureCard text="Automated warning & reward system" />
            <FutureCard text="Mobile companion app" />
            <FutureCard text="Cloud SaaS deployment" />

          </div>

        </section>

      </div>
    </div>
  );
}

/* SMALL COMPONENTS */

const title = "text-2xl font-bold text-gray-800";

function Badge({ text }) {
  return (
    <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-medium">
      {text}
    </span>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all">
      <h3 className="font-bold mb-2 text-indigo-600">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function Step({ title }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:scale-105 transition">
      <p className="font-semibold text-indigo-600">{title}</p>
    </div>
  );
}

function TechCard({ name, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-2xl shadow-lg
    hover:scale-110 hover:rotate-1 transition-all text-center font-bold`}>
      {name}
    </div>
  );
}

function FutureCard({ text }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-xl transition">
      {text}
    </div>
  );
}