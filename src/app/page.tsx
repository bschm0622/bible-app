import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">Welcome to the Bible Reading App</h1>
          <p className="mb-6 text-lg">Start your Bible reading plan today and grow in your faith with a structured journey.</p>
          <Link href="/create_plan">
            <button className="btn btn-primary text-white py-3 px-6 rounded-md text-xl">
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
