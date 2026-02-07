import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="py-12 px-6 border-t border-slate-100 bg-white mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center text-white text-xs overflow-hidden">
              <img
                src="/logo.png"
                alt="Biondesk"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="font-bold text-lg text-dark-900">Biondesk.</span>
          </div>
          <p className="text-sm text-slate-500">
            The operating system for independent creatives.
          </p>
        </div>

        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a
            href="https://threads.com/diaiticom"
            className="hover:text-dark-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Threads
          </a>
          <a
            href="https://instagram.com/diaiticom"
            className="hover:text-dark-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com/diaiticom"
            className="hover:text-dark-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>

        <div className="flex gap-6 text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-slate-600">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-slate-600">
            Terms
          </Link>
          <Link href="/cookie" className="hover:text-slate-600">
            Cookie
          </Link>
          <span>© 2026 Biondesk.</span>
        </div>
      </div>
    </footer>
  );
}
