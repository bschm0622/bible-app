import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Welcome to the Bible Reading App</h1>
      <p className="mt-4">Start your Bible reading plan today!</p>
      <Link href="/create_plan">
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded">
          Get Started
        </button>
      </Link>
    </div>
  );
}
