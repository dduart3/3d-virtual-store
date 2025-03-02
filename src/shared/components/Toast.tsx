import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export const Toast = ({ message, type = 'success', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation before removing
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])
  
  const bgColor = 
    type === 'success' ? 'bg-green-500/60' : 
    type === 'error' ? 'bg-red-500/90' : 
    'bg-blue-500/90'
  
  return (
    <div className={`fixed top-10 right-10 z-[200] transition-all duration-300 
      transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0'}`}>
      <div className={`${bgColor} text-white px-6 py-3 rounded shadow-lg backdrop-blur-sm
        border border-white/20 flex items-center`}>
        {type === 'success' && (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
        {type === 'error' && (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
        {type === 'info' && (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        )}
        {message}
      </div>
    </div>
  )
}
