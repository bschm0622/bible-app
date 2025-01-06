export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome to the Bible Reading App</h1>
      <p className="mt-4">Plan your Bible reading journey with ease.</p>
      <a href="/app" className="mt-8 bg-blue-500 text-white px-4 py-2 rounded">Get Started</a>
    </div>
  );
}
