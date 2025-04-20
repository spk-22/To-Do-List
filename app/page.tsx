"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Moon, Sun, Palette } from "lucide-react"
import TodoItem from "@/components/todo-item"
import AddTodoForm from "@/components/add-todo-form"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Todo = {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  createdAt: Date
}

export type Theme = "default" | "sunset" | "forest" | "ocean" | "candy"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [theme, setTheme] = useState<Theme>("default")
  const [darkMode, setDarkMode] = useState(false)

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error("Failed to parse todos from localStorage")
      }
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    }
    setTodos([...todos, newTodo])
    setShowAddForm(false)
  }

  const toggleComplete = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodo = (id: string, text: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
  }

  const updatePriority = (id: string, priority: Todo["priority"]) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo)))
  }

  const updateCategory = (id: string, category: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, category } : todo)))
  }

  // Get unique categories from todos
  const categories = Array.from(new Set(todos.map((todo) => todo.category).filter(Boolean)))

  // Theme classes based on selected theme
  const themeClasses = {
    default: "bg-white dark:bg-gray-900",
    sunset: "bg-orange-50 dark:bg-gray-900",
    forest: "bg-green-50 dark:bg-gray-900",
    ocean: "bg-blue-50 dark:bg-gray-900",
    candy: "bg-pink-50 dark:bg-gray-900",
  }

  return (
    <main className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${themeClasses[theme]}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">Creative Todo List</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("default")}>Default</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("sunset")}>Sunset</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("forest")}>Forest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("ocean")}>Ocean</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("candy")}>Candy</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Add Todo Button */}
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="mb-6 w-full group transition-all hover:shadow-lg">
            <PlusCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Add New Task
          </Button>
        )}

        {/* Add Todo Form */}
        {showAddForm && (
          <div className="mb-6">
            <AddTodoForm onAdd={addTodo} onCancel={() => setShowAddForm(false)} existingCategories={categories} />
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryTodos = todos.filter((todo) => todo.category === category)
              if (categoryTodos.length === 0) return null

              return (
                <div key={category} className="space-y-4">
                  <h2 className="text-xl font-semibold capitalize px-2 text-gray-800 dark:text-gray-200">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={toggleComplete}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                        onUpdatePriority={updatePriority}
                        onUpdateCategory={updateCategory}
                        existingCategories={categories}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Uncategorized todos */}
        {todos.filter((todo) => !todo.category).length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold px-2 text-gray-800 dark:text-gray-200">Uncategorized</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todos
                .filter((todo) => !todo.category)
                .map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={toggleComplete}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onUpdatePriority={updatePriority}
                    onUpdateCategory={updateCategory}
                    existingCategories={categories}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {todos.length === 0 && (
          <div className="text-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">Your task list is empty</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Add your first task to get started!</p>
          </div>
        )}
      </div>
    </main>
  )
}
