import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, SunMoon, Moon, Sun } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { cn } from './lib/utils'

// Components
import { Logo } from './components/Logo'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { TaskItem } from './components/TaskItem'
import { EmptyState } from './components/EmptyState'

// Define Todo type
interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

// Filter type
type FilterType = 'all' | 'active' | 'completed'
type ThemeType = 'light' | 'dark' | 'system'

function App() {
  // State for todos, new todo input, filter, and theme
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState<ThemeType>('system')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check system preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(theme === 'dark' || (theme === 'system' && prefersDark))
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        setIsDarkMode(e.matches)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('taskify-todos')
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
    localStorage.setItem('taskify-todos', JSON.stringify(todos))
  }, [todos])

  // Add a new todo
  const addTodo = () => {
    if (newTodo.trim() === '') return
    
    const newTodoItem: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now()
    }
    
    setTodos([...todos, newTodoItem])
    setNewTodo('')
    toast.success('Task added successfully')
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

  // Edit a todo
  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ))
    toast.success('Task updated')
  }

  // Filter and search todos
  const filteredTodos = todos
    .filter(todo => {
      // Apply filter
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })
    .filter(todo => {
      // Apply search
      if (!searchQuery.trim()) return true
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      // Sort by creation date (newest first)
      return b.createdAt - a.createdAt
    })

  // Get counts for the filter tabs
  const counts = {
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  }

  // Toggle theme
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  // Get theme icon
  const getThemeIcon = () => {
    if (theme === 'system') return <SunMoon size={18} />
    if (theme === 'dark') return <Moon size={18} />
    return <Sun size={18} />
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-200",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" 
        : "bg-gradient-to-br from-indigo-50 to-purple-50 text-gray-900"
    )}>
      <div className="container mx-auto max-w-2xl px-4 py-12">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <Logo />
          <Button 
            variant="ghost" 
            size="sm" 
            icon={getThemeIcon()} 
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center"
            aria-label="Toggle theme"
          />
        </header>

        {/* Add Todo Form */}
        <div className={cn(
          "rounded-xl p-6 mb-8 transition-colors",
          isDarkMode ? "bg-gray-800" : "bg-white shadow-lg"
        )}>
          <h2 className="text-lg font-medium mb-4">
            Add a new task
          </h2>
          <div className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className={cn(
                isDarkMode && "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              )}
            />
            <Button
              onClick={addTodo}
              icon={<Plus size={18} />}
              aria-label="Add task"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={cn(
          "rounded-xl p-6 mb-6 transition-colors",
          isDarkMode ? "bg-gray-800" : "bg-white shadow-lg"
        )}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                icon={<Search size={18} />}
                className={cn(
                  isDarkMode && "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                )}
              />
            </div>
            <div className="flex rounded-lg overflow-hidden border divide-x shadow-sm transition-colors duration-200 h-10 sm:h-auto">
              {(['all', 'active', 'completed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium capitalize transition-colors",
                    filter === filterType 
                      ? isDarkMode 
                        ? "bg-indigo-600 text-white border-indigo-700" 
                        : "bg-indigo-500 text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                  )}
                >
                  {filterType} ({counts[filterType]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className={cn(
          "rounded-xl overflow-hidden transition-colors",
          isDarkMode ? "bg-gray-800" : "bg-white shadow-lg"
        )}>
          <div className="p-6 pb-4">
            <h2 className="text-lg font-medium flex items-center">
              {filter === 'all' ? 'All tasks' : filter === 'active' ? 'Active tasks' : 'Completed tasks'}
              {filteredTodos.length > 0 && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full",
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                )}>
                  {filteredTodos.length}
                </span>
              )}
            </h2>
          </div>

          {filteredTodos.length === 0 ? (
            <EmptyState 
              message={
                searchQuery 
                  ? `No ${filter} tasks matching "${searchQuery}"`
                  : filter === 'all' 
                    ? "You don't have any tasks yet. Add your first task above!"
                    : `You don't have any ${filter} tasks.`
              }
              filterType={filter}
            />
          ) : (
            <ul className="p-6 pt-2 space-y-3">
              <AnimatePresence initial={false}>
                {filteredTodos.map(todo => (
                  <TaskItem
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} Taskify. All tasks are stored locally in your browser.</p>
        </footer>
      </div>
    </div>
  )
}

export default App