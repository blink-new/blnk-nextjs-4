import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '../lib/utils'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  className?: string
}

export function Checkbox({ checked, onChange, className }: CheckboxProps) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        checked 
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent" 
          : "border-2 border-gray-300 hover:border-indigo-500",
        className
      )}
      whileTap={{ scale: 0.85 }}
      aria-checked={checked}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Check size={12} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  )
}