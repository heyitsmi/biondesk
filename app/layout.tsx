import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flova | The Workflow for Modern Creatives",
  description: "Flova unifies your client workflow. From the first opportunity to the final payment, run your business without the chaos",
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
          rel: 'android-chrome-512x512',
          url: '/favicon/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
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
