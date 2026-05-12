"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "./LanguageProvider";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function CatLoader() {
  const [show, setShow] = useState(true);
  const [animationData, setAnimationData] = useState(null);
  const { t, lang } = useTranslation();

  useEffect(() => {
    // Fetch the Lottie JSON
    fetch("https://tukitaki.vercel.app/src/json/LottieFiles/cat_loader.json")
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Load Error:", err));

    // Hide after initial load simulation
    const timer = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-64 h-64 flex items-center justify-center"
          >
            {animationData ? (
              <Lottie 
                animationData={animationData} 
                loop={true} 
                className="w-full h-full"
              />
            ) : (
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            )}
          </motion.div>
          
          <div className="mt-8 flex flex-col items-center gap-2">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-[4px] italic"
            >
              {t('loading_text')}
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              className="h-1 bg-indigo-500 rounded-full"
              transition={{ duration: 2 }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2"
            >
              {lang === 'en' ? 'Preparing Workspace...' : 'ওয়ার্কস্পেস প্রস্তুত হচ্ছে...'}
            </motion.p>
          </div>

          {/* Background Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
