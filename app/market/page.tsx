"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import {
    Search, Filter, Cpu, Sparkles, Code2,
    Cloud, Terminal, Layout, Eye, Settings,
    Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface MarketPlugin {
    id: string;
    name: string;
    author: string;
    category: string;
    price: string;
    rating: number;
    downloads: string;
    description: string;
    icon: React.ReactNode;
    featured: boolean;
    accent: string;
    download_url?: string;
}

interface VnNotesMarket {
    get_installed_plugins: (callback: (list: string) => void) => void;
    install_plugin: (id: string, url: string) => void;
    installation_status: {
        connect: (callback: (id: string, success: boolean, msg: string) => void) => void;
    };
}

declare global {
    interface Window {
        qt: {
            webChannelTransport: unknown;
        };
        QWebChannel: new (transport: unknown, callback: (channel: { objects: { vnnotes_market: VnNotesMarket } }) => void) => void;
        vnnotes_market: VnNotesMarket;
    }
}

interface PluginCardProps extends MarketPlugin {
    isInstalled: boolean;
    isInstalling: boolean;
    onInstall: (e: React.MouseEvent) => void;
    onClick: () => void;
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Categories for the marketplace
const CATEGORIES = ["All", "AI", "Editor", "Productivity", "UI Themes", "Utilities"];

// Mock Plugin Data for Scalability Demo
const ALL_PLUGINS: MarketPlugin[] = [
    {
        id: "smartai-pro",
        name: "SmartAI Assistant",
        author: "VNNotes Team",
        category: "AI",
        price: "PRO",
        rating: 4.9,
        downloads: "12k+",
        description: "Full AI sidebar with summarization, grammar check, and code explanation.",
        icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
        featured: true,
        accent: "emerald"
    },
    {
        id: "senior-highlighter",
        name: "Senior Highlighter",
        author: "VNNotes Team",
        category: "Editor",
        price: "FREE",
        rating: 4.8,
        downloads: "45k+",
        description: "Universal syntax highlighting with high-contrast professional themes.",
        icon: <Code2 className="w-5 h-5 text-blue-400" />,
        featured: true,
        accent: "blue"
    },
    {
        id: "cloud-sync",
        name: "Cloud Auto-Backup",
        author: "VNNotes Team",
        category: "Productivity",
        price: "$5/mo",
        rating: 5.0,
        downloads: "2k+",
        description: "Secure, encrypted cloud synchronization for all your notes and settings.",
        icon: <Cloud className="w-5 h-5 text-purple-400" />,
        featured: false,
        accent: "purple"
    },
    {
        id: "terminal-plus",
        name: "Embedded Terminal",
        author: "DevStack",
        category: "Utilities",
        price: "FREE",
        rating: 4.5,
        downloads: "8k+",
        description: "Run scripts and system commands directly from a drawer in NotePane.",
        icon: <Terminal className="w-5 h-5 text-orange-400" />,
        featured: false,
        accent: "orange"
    },
    {
        id: "grid-master",
        name: "Grid Workspace Pro",
        author: "VTech",
        category: "UI Themes",
        price: "$2",
        rating: 4.7,
        downloads: "5k+",
        description: "Advanced grid layouts with snapping and session persistence.",
        icon: <Layout className="w-5 h-5 text-pink-400" />,
        featured: false,
        accent: "pink"
    },
    {
        id: "invisible-browser",
        name: "Stealth Browser",
        author: "PrivacyLab",
        category: "Utilities",
        price: "FREE",
        rating: 4.9,
        downloads: "15k+",
        description: "In-app browser that remains invisible to screen sharing applications.",
        icon: <Eye className="w-5 h-5 text-cyan-400" />,
        featured: false,
        accent: "cyan"
    },
    {
        id: "custom-scripts",
        name: "Python Runner",
        author: "OpenSource",
        category: "Editor",
        price: "FREE",
        rating: 4.6,
        downloads: "3k+",
        description: "Execute Python snippets inside your notes with output console.",
        icon: <Cpu className="w-5 h-5 text-yellow-500" />,
        featured: false,
        accent: "yellow"
    },
    {
        id: "config-manager",
        name: "App Settings Sync",
        author: "VTech",
        category: "Utilities",
        price: "FREE",
        rating: 4.4,
        downloads: "1k+",
        description: "Export and import your entire VNNotes configuration in one click.",
        icon: <Settings className="w-5 h-5 text-neutral-400" />,
        featured: false,
        accent: "neutral"
    }
];

export default function Market() {
    return (
        <>
            <Script src="/qwebchannel.js" strategy="beforeInteractive" />
            <MarketContent />
        </>
    );
}

function MarketContent() {
    const [plugins, setPlugins] = useState(ALL_PLUGINS);
    const [installedIds, setInstalledIds] = useState<string[]>([]);
    const [installingId, setInstallingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedPlugin, setSelectedPlugin] = useState<MarketPlugin | null>(null);

    useEffect(() => {
        // Fetch registry from the dedicated plugin repository
        fetch("https://raw.githubusercontent.com/bbqqvv/VNNotes-Plugins/refs/heads/main/plugins.json")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Icon mapping for dynamic rendering
                    const icons: Record<string, React.ReactNode> = {
                        Sparkles: <Sparkles className="w-5 h-5 text-emerald-400" />,
                        Code2: <Code2 className="w-5 h-5 text-blue-400" />,
                        Cloud: <Cloud className="w-5 h-5 text-purple-400" />,
                        Terminal: <Terminal className="w-5 h-5 text-orange-400" />,
                        Layout: <Layout className="w-5 h-5 text-pink-400" />,
                        Eye: <Eye className="w-5 h-5 text-cyan-400" />,
                        Cpu: <Cpu className="w-5 h-5 text-yellow-500" />,
                        Settings: <Settings className="w-5 h-5 text-neutral-400" />
                    };

                    // Map real data from GitHub
                    const dynamicPlugins = data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        author: p.author || "Community",
                        category: p.category || "Utilities",
                        price: p.price || "FREE",
                        rating: p.rating || 5.0,
                        downloads: p.downloads || "New",
                        description: p.description,
                        icon: p.icon_name && icons[p.icon_name] ? icons[p.icon_name] : icons.Sparkles,
                        featured: p.featured || false,
                        accent: "emerald",
                        download_url: p.download_url
                    }));
                    // strictly map real data from GitHub repo (no mock injection)
                    setPlugins(dynamicPlugins);
                }
            })
            .catch(err => console.error("Market: Failed to fetch registry", err));

        // 2. Setup Bridge
        const initBridge = () => {
            if (typeof window !== "undefined" && window.qt && window.QWebChannel) {
                new window.QWebChannel(window.qt.webChannelTransport, (channel) => {
                    const bridge = channel.objects.vnnotes_market;
                    window.vnnotes_market = bridge;

                    // Get initial installed list
                    bridge.get_installed_plugins((list: string) => {
                        try {
                            setInstalledIds(JSON.parse(list));
                        } catch(e) { console.error(e) }
                    });

                    // Listen for status updates
                    bridge.installation_status.connect((id: string, success: boolean, msg: string) => {
                        setInstallingId(null);
                        if (success) {
                            setInstalledIds(prev => [...new Set([...prev, id])]);
                        } else if (msg === "Uninstalled") {
                            setInstalledIds(prev => prev.filter(i => i !== id));
                        }
                    });
                });
            } else if (typeof window !== "undefined" && window.qt) {
                // Wait for QWebChannel to be injected
                setTimeout(initBridge, 100);
            }
        };

        initBridge();
    }, []);

    const handleAction = (id: string, url: string, isInstalled: boolean) => {
        if (typeof window !== "undefined" && window.vnnotes_market) {
            setInstallingId(id);
            if (isInstalled) {
                window.vnnotes_market.uninstall_plugin(id);
            } else {
                window.vnnotes_market.install_plugin(id, url);
            }
        } else {
            // Web browser fallback: Deep Link to VNNotes Desktop
            if (url || isInstalled) {
                setInstallingId(id);
                const action = isInstalled ? "uninstall-plugin" : "install-plugin";
                const deepLink = `vnnotes://${action}?id=${encodeURIComponent(id)}&url=${encodeURIComponent(url || "")}`;
                window.location.href = deepLink;
                
                // Allow time for OS prompt before resetting visual state
                setTimeout(() => {
                    setInstallingId(null);
                }, 2500);
            } else {
                alert("This plugin is unavailable.");
            }
        }
    };

    const filteredPlugins = plugins.filter(plugin => {
        const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === "All" || plugin.category === activeCategory;
        return matchesSearch && matchesCategory;
    });



    return (
        <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">

            {/* Background elements */}
            <div className="fixed inset-0 bg-mesh opacity-50 pointer-events-none z-0" />
            <div className="fixed inset-0 noise pointer-events-none z-[100]" />
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse z-0" />

            <Navbar />

            {/* Hero & Search Header */}
            <header className="pt-32 pb-16 px-6 relative z-10">
                <div className="container mx-auto max-w-4xl text-center">
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
                        Intelligence Marketplace
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white via-white to-neutral-400 bg-clip-text text-transparent leading-tight"
                    >
                        Expand Your <br /> Cortex.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Equip your workspace with <span className="text-emerald-400 font-bold">modular superpowers</span>.
                        No bloat. Absolute zero latency.
                    </motion.p>

                    <motion.div
                        className="max-w-xl mx-auto mb-10 relative group"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="relative bg-black/40 border border-white/10 rounded-xl p-1.5 flex items-center shadow-2xl focus-within:border-emerald-500/50 transition-colors backdrop-blur-xl gap-2">
                            <Search className="ml-3 w-5 h-5 text-neutral-500 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search extensions..."
                                className="w-full bg-transparent border-none py-3 px-2 outline-none text-sm placeholder:text-neutral-600 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <div className="h-6 w-[1px] bg-white/10 flex-shrink-0" />

                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="bg-transparent text-sm font-semibold text-neutral-400 outline-none cursor-pointer py-2 pl-2 pr-6 appearance-none hover:text-white transition-colors flex-shrink-0"
                                style={{ backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem top 50%", backgroundSize: "0.65rem auto" }}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat} className="bg-neutral-900 text-white">{cat}</option>
                                ))}
                            </select>

                            <button className="bg-white text-black px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg active:scale-95 flex-shrink-0 ml-1">
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="py-10 px-6 relative z-10">
                <div className="container mx-auto max-w-6xl">

                    {/* Plugin Grid */}
                    <div className="space-y-12">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-8">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic opacity-20 absolute -mt-10 pointer-events-none select-none">
                                    {activeCategory} Repository
                                </h2>
                                <h2 className="text-2xl font-bold relative z-10">{activeCategory} Extensions</h2>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                                    <Filter className="w-3 h-3 text-emerald-500" />
                                    Sort: <span className="text-neutral-300">Popular</span>
                                </div>
                                <div className="h-4 w-[1px] bg-white/10" />
                                <div className="text-xs font-bold text-neutral-500">
                                    Showing <span className="text-white">{filteredPlugins.length}</span> results
                                </div>
                            </div>
                        </div>

                        {filteredPlugins.length === 0 ? (
                            <motion.div
                                className="py-32 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <Search className="w-full h-full text-neutral-800" />
                                    <motion.div
                                        className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Void Detected</h3>
                                <p className="text-neutral-500 max-w-sm mx-auto">No extensions matched your specific coordinates. Try reset or refine your search.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
                                    className="mt-8 text-emerald-500 font-bold hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredPlugins.map((p, idx) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={p.id}
                                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        >
                                            <PluginCard
                                                {...p}
                                                isInstalled={installedIds.includes(p.id)}
                                                isInstalling={installingId === p.id}
                                                onInstall={(e: React.MouseEvent) => { e.stopPropagation(); handleAction(p.id, p.download_url || "", installedIds.includes(p.id)); }}
                                                onClick={() => setSelectedPlugin(p)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-20 flex justify-center pt-20">
                            <button className="group relative glass px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:text-emerald-400 transition-all overflow-hidden">
                                <span className="relative z-10">Load More Artifacts</span>
                                <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Plugin Details Modal */}
            <AnimatePresence>
                {selectedPlugin && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlugin(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-[#0A0A0A] border border-white/[0.08] rounded-2xl shadow-2xl z-[210] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex gap-6 items-start relative">
                                <button
                                    onClick={() => setSelectedPlugin(null)}
                                    className="absolute top-6 right-6 p-2 text-neutral-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                                    {selectedPlugin.icon}
                                </div>
                                <div className="pr-12">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-3xl font-bold text-white">{selectedPlugin.name}</h2>
                                        {selectedPlugin.price !== 'FREE' && (
                                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                                                {selectedPlugin.price}
                                            </span>
                                        )}
                                        {selectedPlugin.price === 'FREE' && (
                                            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border text-neutral-400 border-white/10 bg-white/5">
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-400 mb-4">by {selectedPlugin.author}</p>

                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-white/10 px-2 py-1 rounded-md bg-white/5">
                                            {selectedPlugin.category}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-md bg-emerald-500/5">
                                            Verified
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-white/10 px-2 py-1 rounded-md bg-white/5">
                                            v1.0.0
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                <h3 className="text-lg font-bold mb-4 text-white">About</h3>
                                <p className="text-neutral-400 leading-relaxed mb-8">
                                    {selectedPlugin.description} This is a longer description for the details modal. It explains exactly what the plugin does and why it is useful for the workflow. It provides comprehensive capabilities without overwhelming the user interface.
                                </p>

                                <h3 className="text-lg font-bold mb-4 text-white">Features</h3>
                                <ul className="space-y-3 mb-8">
                                    {[1, 2, 3].map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-neutral-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                                            Provides seamless integration with core systems, ensuring zero latency and absolute performance across the entire local execution environment.
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-white/5 bg-neutral-950/50 flex justify-end gap-4 mt-auto">
                                <button
                                    onClick={() => setSelectedPlugin(null)}
                                    className="px-6 py-3 rounded-lg text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAction(selectedPlugin.id, selectedPlugin.download_url || "", installedIds.includes(selectedPlugin.id))}
                                    disabled={installingId === selectedPlugin.id}
                                    className={`px-8 py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${installedIds.includes(selectedPlugin.id)
                                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10'
                                        : installingId === selectedPlugin.id
                                            ? 'bg-transparent border-emerald-500/30 text-emerald-400 cursor-wait animate-pulse'
                                            : 'bg-transparent border-white/10 text-neutral-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400'
                                        }`}
                                >
                                    {installingId === selectedPlugin.id ? 'Processing...' : installedIds.includes(selectedPlugin.id) ? 'Uninstall Plugin' : 'Install Plugin'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

function FeaturedCard({ name, description, icon, price, category }: Partial<MarketPlugin>) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="group relative p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0A] hover:bg-[#111111] hover:border-white/[0.15] transition-all duration-300 h-full flex flex-col overflow-hidden"
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-500">
                        {icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Editor&apos;s Pick
                    </span>
                </div>

                <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2 text-white flex items-center gap-2">
                        {name}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                        {description}
                    </p>

                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 border border-white/10 px-2 py-1 rounded-md">
                            {category}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 border border-emerald-500/20 px-2 py-1 rounded-md bg-emerald-500/5">
                            Verified
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-auto border-t border-white/[0.04] pt-5">
                    <button className="flex-grow py-2.5 rounded-lg bg-transparent border border-white/10 text-neutral-300 font-bold text-xs hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
                        Get It Now — {price}
                    </button>
                    <button className="p-2.5 rounded-lg bg-transparent border border-white/10 hover:bg-white/10 transition-colors text-neutral-400 hover:text-white">
                        <Bookmark className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function PluginCard({ name, author, description, icon, price, isInstalled, isInstalling, onInstall, onClick }: PluginCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative p-5 rounded-[20px] border border-white/[0.06] hover:border-white/[0.15] bg-[#0A0A0A] hover:bg-[#111111] transition-all duration-300 h-full flex flex-col cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 text-neutral-300 flex items-center justify-center group-hover:text-emerald-400 transition-colors">
                    {icon}
                </div>
                {price !== 'FREE' && (
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                        {price}
                    </span>
                )}
                {price === 'FREE' && (
                    <span className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded border text-neutral-400 border-white/10 bg-white/5">
                        FREE
                    </span>
                )}
            </div>

            <div className="flex-grow">
                <h3 className="text-base font-semibold text-neutral-200 group-hover:text-white transition-colors">{name}</h3>
                <p className="text-[10px] font-medium text-neutral-500 mb-3">{author}</p>
                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">{description}</p>
            </div>

            <div className="pt-5 mt-auto border-t border-white/[0.04]">
                <button
                    onClick={(e) => onInstall(e)}
                    disabled={isInstalling}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${isInstalled
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-500 hover:bg-rose-500/10'
                        : isInstalling
                            ? 'bg-transparent border-emerald-500/30 text-emerald-400 cursor-wait animate-pulse'
                            : 'bg-transparent border-white/10 text-neutral-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        }`}
                >
                    {isInstalling ? 'Processing...' : isInstalled ? 'Uninstall' : 'Install'}
                </button>
            </div>
        </div>
    );
}
