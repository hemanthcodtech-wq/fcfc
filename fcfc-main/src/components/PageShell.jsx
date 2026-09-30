import { motion } from 'framer-motion'

export default function PageShell({ children }) {
  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-offset="80"
    >
      {children}
    </motion.div>
  )
}
