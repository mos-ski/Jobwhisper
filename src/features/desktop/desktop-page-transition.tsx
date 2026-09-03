import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function DesktopPageTransition({ children }: { readonly children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}
