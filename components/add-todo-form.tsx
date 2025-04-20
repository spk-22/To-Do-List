"use client"

import type React from "react"

import { useState } from "react"
import type { Todo } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AlertTriangle, Clock, Flag } from "lucide-react"

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, "id" | "createdAt">) => void
  onCancel: () => void
  existingCategories: string[]
}

export default function AddTodoForm({ onAdd, onCancel, existingCategories }: AddTodoFormProps) {
  const [text, setText] = useState("")
  const [priority, setPriority] = useState<Todo["priority"]>("medium")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        completed: false,
        priority,
        category: category.trim(),
      })
      setText("")
      setPriority("medium")
      setCategory("")
    }
  }

  return (
    <Card className="border-l-4 border-l-purple-500 bg-white dark:bg-gray-800">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
            rows={3}
            required
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={priority === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriority("low")}
                  className="flex items-center gap-1"
                >
                  <Clock className="h-4 w-4" />
                  Low
                </Button>
                <Button
                  type="button"
                  variant={priority === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriority("medium")}
                  className="flex items-center gap-1"
                >
                  <Flag className="h-4 w-4" />
                  Medium
                </Button>
                <Button
                  type="button"
                  variant={priority === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriority("high")}
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  High
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Work, Personal, Shopping"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                list="add-categories"
              />
              <datalist id="add-categories">
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!text.trim()}>
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
