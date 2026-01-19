import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flova | The Workflow for Modern Creatives",
  description: "Flova unifies your client workflow. From the first opportunity to the final payment, run your business without the chaos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Fonts: Google Sans Flex */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet" />
        
        {/* Phosphor Icons */}
        <script src="https://unpkg.com/@phosphor-icons/web"></script>
      </head>
      <body className="overflow-x-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
