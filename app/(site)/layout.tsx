import { getCurrentUser } from "@/lib/auth";
import "../public.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  return (
    <div className="selection:bg-slate-900 selection:text-white flex flex-col min-h-screen font-sans text-slate-900 bg-[#FAFAFA]">
      <div className="bg-noise"></div>
      <Navbar isAuthenticated={!!session} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
