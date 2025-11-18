import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function PhraseRow({ phrase, catId, onDelete, onUpdate, isDark, t }) {
  const [editing, setEditing] = useState(false)
  const [newText, setNewText] = useState(phrase.text)
  const [justCopied, setJustCopied] = useState(false)

  function handleUpdate() {
    if (newText.trim() !== '') {
      onUpdate(catId, phrase.id, newText)
    }
    setEditing(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(phrase.text)
    setJustCopied(true)
    setTimeout(() => setJustCopied(false), 2000)
  }

  // Calculate rows based on number of lines in text
  const textRows = Math.max(2, Math.min(10, newText.split('\n').length))

  return (
    <div className="flex items-center justify-between py-2 group/phrase">
      {editing ? (
        <div className="flex-1 flex gap-2 animate-fade-in">
          <textarea
            rows={textRows}
            className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all outline-none resize-y max-h-[200px] overflow-auto ${
              isDark 
                ? 'bg-gray-800/50 text-gray-100 border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20' 
                : 'bg-white text-gray-900 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            }`}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setEditing(false)
                setNewText(phrase.text)
              }
            }}
            autoFocus
          />
          <button
            className={`px-4 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              isDark 
                ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
            onClick={handleUpdate}
          >
            <Icon icon="mdi:check" className="w-5 h-5" />
          </button>
          <button
            className={`px-4 py-2.5 rounded-lg font-semibold transition-all ${
              isDark 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => { setEditing(false); setNewText(phrase.text) }}
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          className="flex-1 cursor-pointer relative"
          onDoubleClick={() => setEditing(true)}
        >
          <div
            className={`px-4 py-3 rounded-lg whitespace-pre-line transition-all duration-200 relative group max-h-[200px] overflow-auto ${
              isDark 
                ? 'text-gray-100 hover:bg-purple-900/30' 
                : 'text-gray-900 hover:bg-indigo-50'
            }`}
            title={t.clickToCopy}
            onClick={handleCopy}
          >
            {phrase.text}
            
            {/* Copy indicator */}
            {justCopied && (
              <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-lg text-xs font-semibold animate-fade-in ${
                isDark 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                <span className="flex items-center gap-1">
                  <Icon icon="mdi:check-circle" className="w-4 h-4" />
                  {t.copied}
                </span>
              </div>
            )}

            {/* Hover indicator */}
            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs ${
              isDark ? 'text-purple-400' : 'text-indigo-600'
            }`}>
              <Icon icon="mdi:content-copy" className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
      <button
        aria-label={t.deletePhrase}
        title={t.deletePhrase}
        onClick={() => onDelete(catId, phrase.id)}
        className={`ml-2 p-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 ${
          isDark 
            ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300 opacity-0 group-hover/phrase:opacity-100' 
            : 'text-red-600 hover:bg-red-50 hover:text-red-700 opacity-0 group-hover/phrase:opacity-100'
        }`}
      >
        <Icon icon="mdi:delete" className="w-5 h-5" />
      </button>
    </div>
  )
}
