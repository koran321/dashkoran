'use client'

import { createContext, useContext } from 'react'

const LenisContext = createContext<any>(null)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Lenis is disabled for now to allow the app to run without the extra installation
  return (
    <LenisContext.Provider value={null}>
      {children}
    </LenisContext.Provider>
  )
}

export const useLenis = () => useContext(LenisContext)
