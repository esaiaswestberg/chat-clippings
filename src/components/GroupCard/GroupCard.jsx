import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import PhraseRow from '../PhraseRow/PhraseRow'

export default function GroupCard({ 
  group, 
  index,
  onAddPhrase, 
  onDeleteGroup, 
  onDeletePhrase, 
  onUpdatePhrase, 
  onRenameGroup,
  isDark, 
  t 
}) {
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(group.name)

  function handleRename() {
    const v = (newName || '').trim()
    if (v) onRenameGroup(group.id, v)
    setEditingName(false)
  }

  return (
    <div 
      className={`group relative rounded-xl border transition-all duration-300 transform hover:scale-[1.02] ${
        isDark 
          ? 'glass border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20' 
          : 'bg-white/80 backdrop-blur-sm border-indigo-200/40 hover:border-indigo-300/60 hover:shadow-lg hover:shadow-indigo-500/10'
      } animate-slide-in`}
      style={{ animationDelay: `${index * 0.05}s` }}
    > 
      {/* Category Header */}
      <div className={`flex gap-2 items-center p-3 sm:p-4 pb-2 sm:pb-3 border-b ${isDark ? 'border-purple-500/20' : 'border-indigo-200/40'}`}>
        <div className="flex-1 flex items-center min-w-0">
          {editingName ? (
            <input
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 transition-all text-base sm:text-lg ${
                isDark 
                  ? 'bg-gray-800/50 text-gray-100 border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20' 
                  : 'bg-white text-gray-900 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              } outline-none font-semibold`}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleRename()
                } else if (e.key === 'Escape') {
                  setEditingName(false)
                  setNewName(group.name)
                }
              }}
              autoFocus
            />
          ) : (
            <div
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 font-bold text-base sm:text-lg cursor-text rounded-lg transition-colors truncate ${
                isDark 
                  ? 'text-purple-200 hover:bg-purple-900/20' 
                  : 'text-indigo-900 hover:bg-indigo-50/50'
              }`}
              onDoubleClick={() => { setEditingName(true); setNewName(group.name) }}
            >
              {group.name}
            </div>
          )}
        </div>
        <div className="flex gap-1.5 sm:gap-2 items-center flex-shrink-0">
          <button
            aria-label={t.addPhrase}
            title={t.addPhrase}
            className={`sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 ${
              isDark 
                ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md hover:shadow-purple-500/50' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/50'
            }`}
            onClick={() => onAddPhrase(group.id)}
          >
            <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            aria-label={t.deleteGroup}
            title={t.deleteGroup}
            onClick={() => onDeleteGroup(group.id)}
            className={`sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 p-1.5 sm:p-2 rounded-lg font-semibold transform hover:scale-110 ${
              isDark 
                ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' 
                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
            }`}
          >
            <Icon icon="mdi:delete" className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Phrases */}
      <div className="p-3">
        {group.phrases.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Icon icon="mdi:text-box-outline" className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t.noPhrasesYet}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {group.phrases.map((p, idx) => (
              <React.Fragment key={p.id}>
                <PhraseRow 
                  phrase={p} 
                  catId={group.id} 
                  onDelete={onDeletePhrase} 
                  onUpdate={onUpdatePhrase} 
                  isDark={isDark} 
                  t={t} 
                />
                {idx < group.phrases.length - 1 && (
                  <hr className={`${isDark ? 'border-purple-500/20' : 'border-indigo-200/40'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
