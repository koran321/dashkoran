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
    fetch("https://tukitaki.vercel.app/src/json/LottieFiles/cat_loader.json")
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Load Error:", err));

    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#050816] flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-72 h-72 flex items-center justify-center relative z-10"
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
          
          <div className="mt-8 flex flex-col items-center gap-3 relative z-10">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-black text-white uppercase tracking-[8px] italic font-clash"
            >
              {t('loading_text')}
            </motion.p>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              className="h-1 bg-indigo-500 rounded-full accent-glow"
              transition={{ duration: 1.8 }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px] mt-2"
            >
              {lang === 'en' ? 'Preparing Workspace' : 'ওয়ার্কস্পেস প্রস্তুত হচ্ছে'}
            </motion.p>
          </div>

          {/* Premium Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
