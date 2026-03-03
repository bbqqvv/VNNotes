"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isMarket = pathname === "/market";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-[80] transition-all duration-300 ${isScrolled ? "py-4" : "py-6"}`}>
            <div className="container mx-auto max-w-7xl px-6">
                <div className={`glass-dark rounded-2xl px-6 py-3 flex items-center justify-between transition-all ${isScrolled ? "scale-95 shadow-2xl" : "scale-100"}`}>
                    <Link href="/" className="flex items-center gap-3 group whitespace-nowrap">
                        <div className="relative flex-shrink-0">
                            <img src="/logo.png" alt="VNNotes Logo" className="w-8 h-8 object-contain relative z-10" />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <h1 className="text-xl font-bold tracking-tighter flex items-center">
                                <span className="text-emerald-500">VN</span>
                                <span className="text-white">NOTES</span>
                            </h1>
                            {isMarket && (
                                <>
                                    <span className="mx-3 h-4 w-[1px] bg-white/10 hidden sm:block" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 pt-0.5">
                                        Marketplace
                                    </span>
                                </>
                            )}
                        </div>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-8">
                        {!isMarket && (
                            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                                <Link href="#features" className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Features</Link>
                                <Link href="/market" className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Market</Link>
                                <Link href="/changelog" className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-bold">Changelog</Link>
                            </div>
                        )}

                        {isMarket ? (
                            <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group/back">
                                <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                                <span className="hidden xs:inline font-bold uppercase tracking-widest text-[10px]">Back</span>
                            </Link>
                        ) : null}

                        <Link
                            href="https://github.com/bbqqvv/VNNotes-AnonymNotes/releases/latest"
                            className="bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Download
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
