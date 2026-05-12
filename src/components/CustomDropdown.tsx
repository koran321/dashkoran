"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

export function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  className = "",
  searchable = false
}: { 
  options: Option[], 
  value: string, 
  onChange: (val: string) => void,
  className?: string,
  searchable?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];
  
  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white hover:border-indigo-500 transition-all outline-none"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2 text-zinc-400"
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-[60] w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden py-1 max-h-[300px] flex flex-col"
          >
            {searchable && (
              <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                <Search size={12} className="text-zinc-400" />
                <input 
                  type="text" 
                  className="w-full bg-transparent outline-none text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-colors ${
                      value === opt.value ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : "text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-[8px] font-bold text-zinc-400 uppercase text-center">No results found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
