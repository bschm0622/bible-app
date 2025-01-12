// app/layout.tsx

import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar';
import './globals.css'; // Your global styles

export const metadata = {
  title: "Bible Planner",
  description: "Plan your Bible readings effectively.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap everything in AuthProvider to require authentication on all pages */}
        <AuthProvider>
          {/* Navbar */}
          <Navbar />
          
          {/* Page Content */}
          <main className="container mx-auto p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
