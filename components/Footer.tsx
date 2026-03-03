"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 py-20 relative z-10 overflow-hidden bg-black/20 backdrop-blur-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <div className="container mx-auto max-w-6xl px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 font-bold text-2xl tracking-tighter mb-6">
                            <span className="text-emerald-500">VN</span>Notes Store.
                        </Link>
                        <p className="text-neutral-500 max-w-md leading-relaxed text-sm">
                            The ultimate ecosystem for creative productivity. Empowering developers and writers across the globe with modular intelligence. Built by VTech Digital Solution.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Resources</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            <li><Link href="/" className="hover:text-emerald-400">Documentation</Link></li>
                            <li><Link href="/market" className="hover:text-emerald-400">Marketplace</Link></li>
                            <li><Link href="/changelog" className="hover:text-emerald-400">Changelog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Connect</h4>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            <li><Link href="https://github.com/bbqqvv/VNNotes-AnonymNotes" className="hover:text-emerald-400">GitHub</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400">Discord</Link></li>
                            <li><Link href="/" className="hover:text-emerald-400">Twitter</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">
                    <p>© 2026 VNNotes Global Repository • v2.4.1</p>
                    <div className="flex gap-10">
                        <Link href="/" className="hover:text-white transition-colors text-glow-hover">Privacy Policy</Link>
                        <Link href="/" className="hover:text-white transition-colors">Developer Portal</Link>
                        <Link href="/" className="hover:text-white transition-colors">Legal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
