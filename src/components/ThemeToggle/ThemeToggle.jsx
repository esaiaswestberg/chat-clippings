import { Icon } from '@iconify/react'

export default function ThemeToggle({ isDark, onToggle, t }) {
  return (
    <button 
      className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
        isDark 
          ? 'glass text-white border border-purple-500/30 hover:border-purple-400/50' 
          : 'glass-light text-gray-700 border border-indigo-200 hover:border-indigo-300'
      }`}
      onClick={onToggle}
    >
      <span className="flex items-center gap-2">
        {isDark ? (
          <>
            <Icon icon="mdi:white-balance-sunny" className="w-5 h-5" />
            {t.light}
          </>
        ) : (
          <>
            <Icon icon="mdi:moon-waning-crescent" className="w-5 h-5" />
            {t.dark}
          </>
        )}
      </span>
    </button>
  )
}
