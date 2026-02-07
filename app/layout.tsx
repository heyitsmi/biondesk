import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - Biondesk Workspace",
    default: "Biondesk Workspace",
  },
  description: "From opportunity to paid — in one workflow.",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Biondesk Workspace",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
          rel="stylesheet"
        />
        <script src="https://unpkg.com/lucide@latest"></script>
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
