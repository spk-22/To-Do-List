"use client"

import { useState } from "react"
import type { Todo } from "@/app/page"
import { Check, Trash2, Edit2, Save, X, AlertTriangle, Clock, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
  onUpdatePriority: (id: string, priority: Todo["priority"]) => void
  onUpdateCategory: (id: string, category: string) => void
  existingCategories: string[]
}

export default function TodoItem({
  todo,
  onToggleComplete,
  onDelete,
  onEdit,
  onUpdatePriority,
  onUpdateCategory,
  existingCategories,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState(todo.category || "")

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText)
      setIsEditing(false)
    }
  }

  const handleSaveCategory = () => {
    if (newCategory.trim()) {
      onUpdateCategory(todo.id, newCategory.trim())
    }
    setShowCategoryInput(false)
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const priorityIcons = {
    low: <Clock className="h-4 w-4" />,
    medium: <Flag className="h-4 w-4" />,
    high: <AlertTriangle className="h-4 w-4" />,
  }

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-md bg-white dark:bg-gray-800",
        todo.completed ? "opacity-70" : "opacity-100",
        "border-l-4",
        todo.priority === "high"
          ? "border-l-red-500"
          : todo.priority === "medium"
            ? "border-l-yellow-500"
            : "border-l-blue-500",
      )}
    >
      <CardContent className="pt-6">
        {isEditing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            autoFocus
          />
        ) : (
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className={cn(
                "mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600",
              )}
            >
              {todo.completed && <Check className="h-3 w-3 text-white" />}
            </button>
            <p
              className={cn(
                "text-gray-800 dark:text-gray-200",
                todo.completed && "line-through text-gray-500 dark:text-gray-400",
              )}
            >
              {todo.text}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-4">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs px-2 py-1 rounded-full flex items-center gap-1", priorityColors[todo.priority])}>
            {priorityIcons[todo.priority]}
            {todo.priority}
          </span>

          {showCategoryInput ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-24 text-xs p-1 border rounded"
                placeholder="Category"
                list="categories"
                autoFocus
              />
              <datalist id="categories">
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSaveCategory}>
                <Save className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowCategoryInput(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowCategoryInput(true)}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {todo.category || "Add category"}
            </button>
          )}
        </div>

        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleSaveEdit} className="h-8 px-2">
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditText(todo.text)
                }}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Flag className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onUpdatePriority(todo.id, "low")}>Low</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdatePriority(todo.id, "medium")}>Medium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpdatePriority(todo.id, "high")}>High</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-2">
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(todo.id)}
                className="h-8 px-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
