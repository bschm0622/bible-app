import "./globals.css"; // Your global styles
import { ReactNode } from "react";

export const metadata = {
  title: "Page Pacer",
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
        {/* Add Quicksand font import */}
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className="font-quicksand">
        {children}
      </body>
    </html>
  );
}
