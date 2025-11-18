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
    <header className="flex justify-between items-center gap-3 relative z-50 animate-slide-in">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-indigo-500 to-purple-500'} shadow-lg`}>
          <Icon icon="mdi:clipboard-text" className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${isDark ? 'from-purple-400 via-pink-400 to-indigo-400' : 'from-indigo-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
            {t.appTitle}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.appSubtitle}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          className={`group relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50'
          }`}
          onClick={onAddGroup}
        >
          <span className="flex items-center gap-2">
            <Icon icon="mdi:plus-circle" className="w-5 h-5" />
            {t.addGroup}
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
