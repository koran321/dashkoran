"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Info, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Globe 
} from "lucide-react";
import Link from "next/link";

export default function InfoPage() {
  const routes = [
    {
      title: "Admin Dashboard",
      path: "/",
      description: "The primary engine for Agency OS. Manage tasks, writers, clients, and financial logs.",
      status: "Private",
      access: "Password Protected",
      icon: <LayoutDashboard className="text-indigo-500" size={24} />,
      color: "from-indigo-500/20 to-purple-500/20"
    },
    {
      title: "Tracking Portal",
      path: "/track",
      description: "Generic entry point for clients to search for their order status using an ID.",
      status: "Public",
      access: "Unrestricted",
      icon: <Search className="text-emerald-500" size={24} />,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Direct Tracking",
      path: "/track/[ORDER_ID]",
      description: "Deep link for clients to view a specific assignment's progress bar and timeline.",
      status: "Public",
      access: "Requires Order ID",
      icon: <Zap className="text-amber-500" size={24} />,
      color: "from-amber-500/20 to-orange-500/20"
    },
    {
      title: "Client Portal",
      path: "/client",
      description: "Overview of client-related activities and assignment histories.",
      status: "Private",
      access: "Admin Access",
      icon: <Users className="text-rose-500" size={24} />,
      color: "from-rose-500/20 to-pink-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6 sm:p-12 font-satoshi selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
            <Globe size={14} /> System Infrastructure
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter font-clash">
            Agency <span className="text-indigo-500">Routes</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
            A comprehensive map of all accessible portals within the Assignment Koran ecosystem.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routes.map((route, i) => (
            <motion.div
              key={route.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative glass-card p-8 border border-white/5 rounded-[2.5rem] overflow-hidden"
            >
              {/* Glow Accent */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-10 bg-gradient-to-br ${route.color}`} />
              
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-indigo-500/30 transition-all duration-500">
                    {route.icon}
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    route.status === 'Public' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {route.status}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight font-clash group-hover:text-indigo-400 transition-colors">{route.title}</h3>
                  <code className="block text-[11px] font-black text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 w-fit">
                    {route.path}
                  </code>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed">
                  {route.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{route.access}</span>
                  </div>
                  <Link 
                    href={route.path.replace('[ORDER_ID]', 'AK-7X9Z')} 
                    className="p-3 rounded-xl bg-white text-zinc-950 hover:bg-indigo-500 hover:text-white transition-all duration-300"
                  >
                    <ExternalLink size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-12 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">
            Assignment Koran © 2026 • Private Infrastructure
          </p>
        </motion.div>
      </div>
    </div>
  );
}
