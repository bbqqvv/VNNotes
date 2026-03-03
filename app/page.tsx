"use client";

import { Download, Ghost, FileText, Globe, Move, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-emerald-500/30 relative overflow-x-hidden">

      {/* Background elements to match the new artistic theme */}
      <div className="fixed inset-0 bg-mesh opacity-50 pointer-events-none z-0" />
      <div className="fixed inset-0 noise pointer-events-none z-[100]" />
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse z-0" />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden z-10">
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-6 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>v2.0.1.1 is now live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-white to-neutral-400 bg-clip-text text-transparent leading-tight"
          >
            The Secret Weapon <br /> for Professional Flow.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The only workspace designed to be <span className="text-emerald-400 font-bold">completely invisible</span> to screen sharing.
            Bridge your workflow between Word, Web, and Notes—secretly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="https://github.com/bbqqvv/VNNotes-AnonymNotes/releases/latest/download/VNNotes_Setup.exe"
              className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Download className="w-4 h-4 group-hover:animate-bounce" />
              Download for Windows
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 rounded-xl glass font-bold uppercase tracking-widest text-[10px] text-neutral-400 hover:text-white transition-all active:scale-95 border border-white/5"
            >
              Learn more
            </Link>
          </motion.div>

          {/* App Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 relative rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm shadow-2xl overflow-hidden p-2 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-purple-500/10 pointer-events-none group-hover:opacity-100 transition-opacity" />
            <div className="aspect-[16/9] bg-neutral-900 rounded-xl flex items-center justify-center border border-white/5 overflow-hidden shadow-inner">
              <video
                src="/video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover pointer-events-none opacity-80 group-hover:opacity-100 transition-all duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 px-6 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-r from-white to-neutral-600 bg-clip-text text-transparent">Powerful. Private. Invisible.</h2>
            <p className="text-neutral-500 max-w-xl mx-auto font-medium">Everything you need to work secretly, built into one lightweight app powered by modern intelligence.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
              title="SQLite Core"
              description="Now powered by SQLite for massive performance and reliability. Your notes are stored in a professional database, ensuring zero data loss."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-yellow-400" />}
              title="Smart Grid"
              description="Automatically split your notes into customizable grids. Perfect for multi-tasking and managing complex research projects."
            />
            <FeatureCard
              icon={<Move className="w-6 h-6 text-orange-400" />}
              title="Fluid Zoom"
              description="Seamlessly zoom in and out of your documents using mouse scroll. Maintain legibility for long scripts while keeping focus."
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-blue-400" />}
              title="Pro Themes"
              description="Choose from over 10 built-in themes to match your environment. From high-contrast dark modes to soft light themes."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-purple-400" />}
              title="Rich Format"
              description="Full control over text color, highlights, and font sizes. Format your scripts exactly how you need them."
            />
            <FeatureCard
              icon={<Ghost className="w-6 h-6 text-red-500" />}
              title="Invisibility"
              description="100% invisible to Zoom and Teams. Anti-capture technology stays off by default, activating only when needed."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center relative z-10">
        <motion.div
          className="container mx-auto max-w-3xl glass p-16 rounded-[3rem] relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Ghost className="w-32 h-32" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase italic">Ready to work in <span className="text-emerald-500">stealth?</span></h2>
          <p className="text-neutral-400 mb-12 text-lg font-medium">
            Join thousands of professionals who value their privacy and workflow.
            <br />Free and open source for everyone.
          </p>
          <Link
            href="https://github.com/bbqqvv/VNNotes-AnonymNotes/releases/latest/download/VNNotes_Setup.exe"
            className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all hover:scale-105 shadow-2xl shadow-emerald-500/20 active:scale-95"
          >
            <Download className="w-5 h-5" />
            Download v2.0.1.1
          </Link>
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">
            Windows 10/11 • 64-bit • Installer (~121MB)
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group flex flex-col h-full"
    >
      <div className="mb-6 p-4 rounded-xl bg-black/40 w-fit group-hover:scale-110 transition-transform border border-white/5 shadow-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-neutral-500 leading-relaxed text-sm font-medium">{description}</p>
    </motion.div>
  );
}
