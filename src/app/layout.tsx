import "./globals.css"; // Your global styles
import Navbar from '@components/Navbar';

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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <body>
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="container mx-auto p-4">{children}</main>
=======
=======
>>>>>>> Stashed changes
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className="bg-white text-gray-900"> {/* Apply no background here */}
        {children}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
