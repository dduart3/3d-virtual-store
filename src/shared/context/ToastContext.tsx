import { createContext, useContext, useState, ReactNode } from 'react'
import { Toast, ToastType } from '../components/Toast'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  
  const showToast = (message: string, type: ToastType = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }
  
  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
