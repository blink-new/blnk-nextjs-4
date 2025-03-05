import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Trash2, Check, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { Checkbox } from './Checkbox'

interface TaskItemProps {
  id: string
  text: string
  completed: boolean
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
}

export function TaskItem({ id, text, completed, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(text)

  const handleSave = () => {
    if (editText.trim() === '') return
    onEdit(id, editText.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(text)
    setIsEditing(false)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow transition-all duration-200 overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              <button 
                onClick={handleSave}
                className="p-2 text-green-600 hover:text-green-800 transition-colors rounded-full hover:bg-green-50"
                aria-label="Save"
              >
                <Check size={18} />
              </button>
              <button 
                onClick={handleCancel}
                className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                aria-label="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center p-4 gap-3"
          >
            <Checkbox checked={completed} onChange={() => onToggle(id)} />
            
            <span 
              className={cn(
                "flex-1 transition-all duration-200",
                completed ? "text-gray-400 line-through" : "text-gray-800"
              )}
            >
              {text}
            </span>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(true)
                  setEditText(text)
                }}
                className="p-2 text-gray-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                aria-label="Edit task"
              >
                <Edit size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(id)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}