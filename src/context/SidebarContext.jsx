// src/context/SidebarContext.jsx
import { createContext, useState, useContext } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [sidebarHovered, setSidebarHovered] = useState(false)

  return (
    <SidebarContext.Provider value={{ sidebarHovered, setSidebarHovered }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}