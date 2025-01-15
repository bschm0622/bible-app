import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Navbar */}
      <nav className="navbar bg-transparent top-0 left-0 w-full z-50 shadow-none">
        <div className="container mx-auto flex justify-between items-center px-8 py-6">
          <Link href="/" className="text-2xl font-semibold text-primary">
            Bible Reading App
          </Link>
          <div className="flex items-center gap-6">
            <ul className="menu menu-horizontal p-0 space-x-6 text-lg">
              <li>
                <a href="#pricing" className="text-gray-700 hover:text-primary">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-700 hover:text-primary">
                  FAQ
                </a>
              </li>
            </ul>
            <Link href="/login">
              <button className="btn btn-primary rounded-full text-white hover:bg-primary-focus transition duration-300">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center max-w-7xl mx-auto text-center py-32 px-8">
        <div className="lg:w-1/2">
          <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight flex flex-col gap-4 items-center">
            <span className="relative">
              <span className="absolute bg-neutral-content -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1"></span>
              <span className="text-neutral relative">
                Build <span className="relative text-primary">Habits</span> That
              </span>
            </span>
            <span className="whitespace-nowrap relative mt-4">
              <span className="mr-3 sm:mr-4 md:mr-5">Deepen</span>
              <span className="relative whitespace-nowrap">
                <span className="absolute bg-primary-content -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 rotate-1"></span>
                <span className="relative text-primary">Your Faith</span>
              </span>
            </span>
          </h1>


          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed mt-6">
            Stay consistent in your Bible reading journey with personalized plans. Start whenever you want, read at your own pace, and track your spiritual progress easily.
          </p>

          <ul className="list-none text-left max-w-xl mx-auto text-lg mb-8 space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary text-2xl mr-3">✔</span>
              <span>Customized Bible reading plans that work for you.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary text-2xl mr-3">✔</span>
              <span>Start your journey anytime, with flexibility to read what you want.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary text-2xl mr-3">✔</span>
              <span>Track your progress and celebrate milestones in your faith.</span>
            </li>
          </ul>

          <Link href="/login">
            <button className="btn btn-primary px-8 py-3 rounded-full text-white hover:bg-primary-focus transition duration-300 mt-6">
              Get Started
            </button>
          </Link>
        </div>
      </section>



      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-16 px-8 text-center">
        <h2 className="text-4xl font-bold text-primary mb-6">Pricing</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Simple, affordable pricing for all types of Bible readers. Choose a plan that fits your pace and journey.
        </p>
        <p className="text-sm text-gray-500 mt-4">Details coming soon...</p>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 py-16 px-8 text-center">
        <h2 className="text-4xl font-bold text-primary mb-6">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Got questions? We’ve got answers. Here’s a quick guide to get you started.
        </p>
        <p className="text-sm text-gray-500 mt-4">FAQ content coming soon...</p>
      </section>
    </div>
  );
}
