import { Icon } from '@iconify/react'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

export default function Header({ 
  isDark, 
  language, 
  onToggleTheme, 
  onLanguageChange, 
  onAddGroup, 
  t 
}) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 relative z-50 animate-slide-in">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-indigo-500 to-purple-500'} shadow-lg`}>
          <Icon icon="mdi:clipboard-text" className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${isDark ? 'from-purple-400 via-pink-400 to-indigo-400' : 'from-indigo-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
            {t.appTitle}
          </h1>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.appSubtitle}
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <button 
          className={`group relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex-1 sm:flex-none ${
            isDark 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50'
          }`}
          onClick={onAddGroup}
        >
          <span className="flex items-center gap-1.5 sm:gap-2 justify-center">
            <Icon icon="mdi:plus-circle" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{t.addGroup}</span>
          </span>
        </button>
        <LanguageSwitcher 
          language={language}
          onLanguageChange={onLanguageChange}
          isDark={isDark}
          t={t}
        />
        <ThemeToggle 
          isDark={isDark}
          onToggle={onToggleTheme}
          t={t}
        />
      </div>
    </header>
  )
}
