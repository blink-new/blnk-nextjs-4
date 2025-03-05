import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'

interface EmptyStateProps {
  message: string
  filterType?: string
}

export function EmptyState({ message, filterType }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-12 px-4 flex flex-col items-center justify-center text-center"
    >
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
        <ClipboardList size={24} className="text-indigo-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
      <p className="text-gray-500 max-w-sm">{message}</p>
      
      {filterType && filterType !== 'all' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-sm text-indigo-600"
        >
          Try switching to "All" to see all your tasks
        </motion.p>
      )}
    </motion.div>
  )
}