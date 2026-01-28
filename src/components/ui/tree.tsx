"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

interface TreeContextValue {
  indent: number
  selectedId: string | undefined
  expandedItems: string[]
  handleExpand: (id: string) => void
  selectItem: (id: string) => void
}

const TreeContext = React.createContext<TreeContextValue>({
  indent: 20,
  selectedId: undefined,
  expandedItems: [],
  handleExpand: () => {},
  selectItem: () => {},
})

function useTreeContext() {
  return React.useContext(TreeContext)
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  indent?: number
  selectedId?: string
  expandedItems?: string[]
  onSelectChange?: (id: string) => void
  onExpandChange?: (items: string[]) => void
}

function Tree({ 
  indent = 20, 
  selectedId,
  expandedItems = [],
  onSelectChange,
  onExpandChange,
  className, 
  children,
  ...props 
}: TreeProps) {
  const handleExpand = React.useCallback((id: string) => {
    const newItems = expandedItems.includes(id)
      ? expandedItems.filter(item => item !== id)
      : [...expandedItems, id]
    onExpandChange?.(newItems)
  }, [expandedItems, onExpandChange])

  const selectItem = React.useCallback((id: string) => {
    onSelectChange?.(id)
  }, [onSelectChange])

  return (
    <TreeContext.Provider value={{ indent, selectedId, expandedItems, handleExpand, selectItem }}>
      <div
        className={cn("flex flex-col", className)}
        style={{ "--tree-indent": `${indent}px` } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    </TreeContext.Provider>
  )
}

interface TreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  itemId: string
  level?: number
  asChild?: boolean
}

function TreeItem({
  itemId,
  level = 0,
  className,
  asChild,
  children,
  ...props
}: TreeItemProps) {
  const { indent, selectedId, selectItem } = useTreeContext()
  const isSelected = selectedId === itemId

  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-md text-sm transition-colors",
        "hover:bg-accent/50",
        isSelected && "bg-primary/10 text-primary",
        className
      )}
      style={{ paddingLeft: `${level * indent + 8}px` }}
      onClick={() => selectItem(itemId)}
      {...props}
    >
      {children}
    </Comp>
  )
}

interface TreeFolderProps extends React.HTMLAttributes<HTMLDivElement> {
  itemId: string
  level?: number
  label: React.ReactNode
}

function TreeFolder({
  itemId,
  level = 0,
  label,
  className,
  children,
  ...props
}: TreeFolderProps) {
  const { indent, expandedItems, handleExpand } = useTreeContext()
  const isExpanded = expandedItems.includes(itemId)

  return (
    <div className={className} {...props}>
      <button
        className={cn(
          "w-full flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-md text-sm transition-colors",
          "hover:bg-accent/50 text-left"
        )}
        style={{ paddingLeft: `${level * indent + 8}px` }}
        onClick={() => handleExpand(itemId)}
      >
        <ChevronDownIcon 
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            !isExpanded && "-rotate-90"
          )} 
        />
        {label}
      </button>
      {isExpanded && (
        <div className="flex flex-col">
          {children}
        </div>
      )}
    </div>
  )
}

export { Tree, TreeItem, TreeFolder, useTreeContext }
