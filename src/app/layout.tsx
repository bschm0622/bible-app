import "./globals.css"; // Your global styles

export const metadata = {
  title: "Bible Planner",
  description: "Plan your Bible readings effectively.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className="bg-white text-gray-900"> {/* Apply no background here */}
        {children}
      </body>
    </html>
  );
}
