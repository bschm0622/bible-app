import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center px-8 py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            Page Pacer
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-700 hover:text-primary">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary">
              How It Works
            </a>
            <a href="#about" className="text-gray-700 hover:text-primary">
              About
            </a>
            <Link href="/login">
              <button className="btn btn-outline btn-primary">Log In</button>
            </Link>
            <Link href="/signup">
              <button className="btn btn-primary text-white px-6 py-2">
                Sign Up
              </button>
            </Link>
          </div>
          <div className="md:hidden">
            <label htmlFor="menu" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
            Build Habits That Deepen Your Faith
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed">
            Stay consistent in your Bible reading journey with personalized
            plans. Start whenever you want, read at your own pace, and track
            your spiritual progress easily.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <button className="btn btn-primary px-8 py-3 text-white">
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button className="btn btn-outline btn-primary px-8 py-3">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white px-4 md:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800">Features</h2>
          <p className="text-gray-600 max-w-lg mx-auto mt-4">
            Discover how Page Pacer can help you stay consistent and achieve
            your spiritual goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Custom Plans",
                description: "Build a reading plan tailored to your schedule.",
                icon: "📅",
              },
              {
                title: "Track Progress",
                description: "Visualize your journey and celebrate milestones.",
                icon: "📈",
              },
              {
                title: "Flexible Start",
                description: "Begin anytime and adjust your pace as needed.",
                icon: "⏰",
              },
            ].map((feature, idx) => (
              <FeatureCard
                key={idx}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50 px-4 md:px-8">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-800">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-8 mt-12">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your account and get started.",
              },
              {
                step: "2",
                title: "Build Your Plan",
                description: "Customize your plan to fit your schedule.",
              },
              {
                step: "3",
                title: "Track Progress",
                description: "Monitor your progress and celebrate milestones.",
              },
            ].map((step, idx) => (
              <StepCard
                key={idx}
                step={step.step}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white px-4 md:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-800">About Page Pacer</h2>
          <p className="text-gray-600 mt-4">
            Page Pacer was created to help Christians deepen their faith by
            staying consistent in their Bible reading. Our mission is to make
            Bible reading accessible, flexible, and enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white px-4 md:px-8">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Page Pacer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
    <div className="text-4xl">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mt-4">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);

const StepCard = ({ step, title, description }: { step: string; title: string; description: string }) => (
  <div className="p-6 bg-white rounded-lg shadow-md flex-1 text-left transition-transform transform hover:scale-105">
    <span className="block text-4xl font-extrabold text-primary">{step}</span>
    <h3 className="text-xl font-semibold text-gray-800 mt-2">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);
