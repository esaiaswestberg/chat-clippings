import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel, isDark, t }) {
  const [closing, setClosing] = useState(false)
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    if (isOpen && !closing) {
      setOpening(true)
    } else {
      setOpening(false)
    }
  }, [isOpen, closing])

  function handleClose() {
    setClosing(true)
    setTimeout(() => {
      onCancel()
      setClosing(false)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 p-4 ${
      closing ? 'opacity-0' : opening ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-[95vw] sm:w-auto sm:min-w-[420px] max-w-[90vw] flex flex-col gap-3 sm:gap-4 border transition-all duration-200 ${
        isDark 
          ? 'glass border-purple-500/30' 
          : 'bg-white border-indigo-200'
      } ${
        closing 
          ? 'opacity-0 scale-95 translate-y-4' 
          : opening 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-red-600' : 'bg-red-500'}`}>
            <Icon icon="mdi:alert-circle" className="w-6 h-6 text-white" />
          </div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-purple-200' : 'text-indigo-900'}`}>{t.confirmDeletion}</h2>
        </div>
        <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {message}
        </p>
        <div className="flex gap-3 justify-end mt-2">
          <button
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDark 
                ? 'bg-red-600 text-white shadow-lg hover:bg-red-500 hover:shadow-red-500/50' 
                : 'bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-red-500/50'
            }`}
            onClick={onConfirm}
          >
            <span className="flex items-center gap-2">
              <Icon icon="mdi:delete" className="w-5 h-5" />
              {t.delete}
            </span>
          </button>
          <button
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              isDark 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={handleClose}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}
