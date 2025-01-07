import "./globals.css"; // Your global styles
import Navbar from './components/Navbar';


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
      <body>
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
