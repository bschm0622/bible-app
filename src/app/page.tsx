import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">Welcome to Verdant Verse</h1>
          <p className="mb-6 text-lg">Create a custom Bible reading plan today and grow in your faith with a structured journey.</p>
          <Link href="/create_plan">
            <button className="btn btn-primary text-white py-3 px-6 rounded-md text-xl">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
