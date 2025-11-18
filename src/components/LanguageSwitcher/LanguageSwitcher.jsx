import { useState } from 'react'
import { Icon } from '@iconify/react'
import { languageOptions } from '../../constants/languages'

export default function LanguageSwitcher({ language, onLanguageChange, isDark, t }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="relative z-50">
      <button 
        className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
          isDark 
            ? 'glass text-white border border-purple-500/30 hover:border-purple-400/50' 
            : 'glass-light text-gray-700 border border-indigo-200 hover:border-indigo-300'
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={t.switchLanguage}
      >
        <span className="flex items-center gap-2">
          <Icon icon="mdi:web" className="w-5 h-5" />
          {language.toUpperCase()}
        </span>
      </button>
      {dropdownOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setDropdownOpen(false)}
          />
          {/* Dropdown menu */}
          <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border z-50 overflow-hidden animate-slide-in ${
            isDark 
              ? 'glass border-purple-500/30' 
              : 'bg-white border-indigo-200'
          }`}>
            {languageOptions.map(lang => (
              <button
                key={lang.code}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
                  language === lang.code
                    ? isDark
                      ? 'bg-purple-600/30 text-purple-200'
                      : 'bg-indigo-100 text-indigo-900'
                    : isDark
                      ? 'text-gray-200 hover:bg-purple-900/20'
                      : 'text-gray-700 hover:bg-indigo-50'
                }`}
                onClick={() => {
                  onLanguageChange(lang.code)
                  setDropdownOpen(false)
                }}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <Icon icon="mdi:check" className="w-5 h-5 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
