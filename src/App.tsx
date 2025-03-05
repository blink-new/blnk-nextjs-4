import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, X, Edit, Trash2 } from 'lucide-react'
import { cn } from './lib/utils'
import { toast } from 'react-hot-toast'

// Define Todo type
interface Todo {
  id: string
  text: string
  completed: boolean
}

// Filter type
type FilterType = 'all' | 'active' | 'completed'

function App() {
  // State for todos, new todo input, filter, and editing
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error('Failed to parse saved todos')
      }
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim() === '') return
    
    const newTodoItem: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false
    }
    
    setTodos([...todos, newTodoItem])
    setNewTodo('')
    toast.success('Task added')
  }

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
    toast.success('Task deleted')
  }

  // Start editing a todo
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  // Save edited todo
  const saveEdit = () => {
    if (editText.trim() === '') return
    
    setTodos(todos.map(todo => 
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ))
    
    setEditingId(null)
    toast.success('Task updated')
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
  }

  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // Get counts for the filter tabs
  const counts = {
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col items-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-primary-800 text-center mb-8">
          Todo App
        </h1>

        {/* Add Todo Form */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 p-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <button
              onClick={addTodo}
              className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-r-md transition-colors"
              aria-label="Add task"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex divide-x divide-gray-200">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors",
                  filter === filterType 
                    ? "text-primary-600 bg-primary-50" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {filterType} ({counts[filterType]})
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredTodos.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {filter === 'all' 
                ? "Add your first task above!" 
                : `No ${filter} tasks found.`}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredTodos.map(todo => (
                  <motion.li
                    key={todo.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    {editingId === todo.id ? (
                      <div className="flex items-center p-4">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1 p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400"
                          autoFocus
                        />
                        <button 
                          onClick={saveEdit}
                          className="ml-2 p-2 text-green-600 hover:text-green-800 transition-colors"
                          aria-label="Save"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="ml-1 p-2 text-red-600 hover:text-red-800 transition-colors"
                          aria-label="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center p-4 group">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={cn(
                            "flex-shrink-0 w-5 h-5 rounded-full border mr-3 flex items-center justify-center transition-colors",
                            todo.completed 
                              ? "bg-primary-500 border-primary-500" 
                              : "border-gray-300 hover:border-primary-500"
                          )}
                          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {todo.completed && <Check size={12} className="text-white" />}
                        </button>
                        <span 
                          className={cn(
                            "flex-1 transition-all",
                            todo.completed && "text-gray-400 line-through"
                          )}
                        >
                          {todo.text}
                        </span>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditing(todo)}
                            className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                            aria-label="Edit task"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            aria-label="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default App