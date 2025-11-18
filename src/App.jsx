import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

const STORAGE_KEY = 'chat-clippings-data-v1'
const THEME_KEY = 'chat-clippings-theme'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) === 'dark'
}

function saveTheme(isDark) {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
}

const defaultData = [
  { id: uid(), name: 'Greetings', phrases: [{ id: uid(), text: 'Hello!' }, { id: uid(), text: 'Hi there' }] },
  { id: uid(), name: 'Sign-offs', phrases: [{ id: uid(), text: 'Take care' }, { id: uid(), text: 'Thanks!' }] }
]

export default function App() {
  const [categories, setCategories] = useState(() => loadData() ?? defaultData)
  const [dialogCatId, setDialogCatId] = useState(null)
  const [dialogPhrase, setDialogPhrase] = useState('')
  const [isDark, setIsDark] = useState(() => loadTheme())
  const [editingCatId, setEditingCatId] = useState(null)
  const [editingCatName, setEditingCatName] = useState('')

  useEffect(() => {
    saveData(categories)
  }, [categories])

  useEffect(() => {
    saveTheme(isDark)
  }, [isDark])

  function toggleTheme() {
    setIsDark(prev => !prev)
  }

  function addCategory(name) {
    const n = (name || '').trim()
    if (!n) return
    const c = { id: uid(), name: n, phrases: [] }
    setCategories(prev => [...prev, c])
  }

  function promptAddCategory() {
    const name = window.prompt('New category name:')
    if (name && name.trim()) addCategory(name.trim())
  }

  function deleteCategory(id) {
    setCategories(prev => prev.filter(c => c.id !== id))
    setNewPhraseByCat(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  function addPhrase(catId, text) {
    const t = (text || '').trim()
    if (!t) return
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, phrases: [...c.phrases, { id: uid(), text: t }] } : c))
  }

  function deletePhrase(catId, phraseId) {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, phrases: c.phrases.filter(p => p.id !== phraseId) } : c))
  }

  function updatePhrase(catId, phraseId, text) {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, phrases: c.phrases.map(p => p.id === phraseId ? { ...p, text } : p) } : c))
  }

  function renameCategory(id, newName) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c))
  }

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <main className="flex-1 p-5 flex flex-col gap-3">
        <header className="flex justify-between items-center gap-3">
          <h2 className="text-xl font-semibold">All Categories</h2>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-3 py-2 rounded-md hover:opacity-95 cursor-pointer" onClick={promptAddCategory}>+ Add category</button>
            <button className={`px-3 py-2 rounded-md hover:opacity-95 cursor-pointer ${isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-600 text-white'}`} onClick={toggleTheme}>
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </header>

        <section className={`p-3 rounded-lg flex-1 border overflow-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(510px, 1fr))' }}>
            {categories.map(cat => (
              <div key={cat.id} className={`p-3 rounded-lg border group flex flex-col ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}> 
                <div className="flex gap-2 items-center mb-2 justify-between">
                  <div className="flex-1 flex items-center">
                    {editingCatId === cat.id ? (
                      <input
                        className={`flex-1 px-2 py-2 rounded-md border ${isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        value={editingCatName}
                        onChange={e => setEditingCatName(e.target.value)}
                        onBlur={() => {
                          const v = (editingCatName || '').trim()
                          if (v) renameCategory(cat.id, v)
                          setEditingCatId(null)
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const v = (editingCatName || '').trim()
                            if (v) renameCategory(cat.id, v)
                            setEditingCatId(null)
                          } else if (e.key === 'Escape') {
                            setEditingCatId(null)
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div
                        className={`flex-1 px-2 py-2 font-medium cursor-text ${isDark ? 'text-gray-100' : 'text-gray-900'}`}
                        onDoubleClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name) }}
                      >
                        {cat.name}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      aria-label="Add phrase"
                      title="Add phrase"
                      className={`px-2 py-1 rounded text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700`}
                      onClick={() => { setDialogCatId(cat.id); setDialogPhrase('') }}
                    >
                      +
                    </button>
                    <button
                      aria-label="Delete category"
                      title="Delete category"
                      onClick={() => deleteCategory(cat.id)}
                      className={`opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded text-xs font-semibold ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="flex flex-col">
                  {cat.phrases.map((p, idx) => (
                    <React.Fragment key={p.id}>
                      <PhraseRow phrase={p} catId={cat.id} onDelete={deletePhrase} onUpdate={updatePhrase} isDark={isDark} />
                      {idx < cat.phrases.length - 1 && (
                        <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {/* Dialog for adding phrase */}
            {dialogCatId !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] flex flex-col gap-4`}>
                  <h2 className="text-lg font-semibold mb-2">Add Phrase</h2>
                  <textarea
                    className="w-full p-2 border rounded-md resize-y min-h-[80px] dark:bg-gray-700 dark:text-gray-100"
                    value={dialogPhrase}
                    autoFocus
                    onChange={e => setDialogPhrase(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') setDialogCatId(null)
                    }}
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      className="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        if (dialogPhrase.trim()) {
                          addPhrase(dialogCatId, dialogPhrase)
                          setDialogCatId(null)
                        }
                      }}
                    >Add</button>
                    <button
                      className="px-3 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500"
                      onClick={() => setDialogCatId(null)}
                    >Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function PhraseRow({ phrase, catId, onDelete, onUpdate, isDark }) {
  const [editing, setEditing] = useState(false)
  const [newText, setNewText] = useState(phrase.text)
  const [justCopied, setJustCopied] = useState(false)

  function handleUpdate() {
    if (newText.trim() !== '') {
      onUpdate(catId, phrase.id, newText)
    }
    setEditing(false)
  }

  return (
    <div className="flex items-center justify-between py-2">
      {editing ? (
        <div className="flex-1 flex gap-2">
          <input
            className={`flex-1 px-3 py-2 rounded-md border ${isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleUpdate()
              } else if (e.key === 'Escape') {
                setEditing(false)
                setNewText(phrase.text)
              }
            }}
            autoFocus
          />
          <button
            className={`px-3 py-2 rounded-md text-xs font-semibold ${isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            onClick={handleUpdate}
          >
            Save
          </button>
          <button
            className={`px-3 py-2 rounded-md text-xs font-semibold ${isDark ? 'bg-gray-700 text-gray-100 hover:bg-gray-600' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'}`}
            onClick={() => { setEditing(false); setNewText(phrase.text) }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div
          className="flex-1 cursor-pointer"
          onDoubleClick={() => setEditing(true)}
        >
          <div
            className={`px-3 py-2 rounded-md whitespace-pre-line transition-colors duration-150 ${isDark ? 'text-gray-100 hover:bg-blue-900' : 'text-gray-900 hover:bg-blue-100'}`}
            title="Click to copy"
            onClick={() => {
              navigator.clipboard.writeText(phrase.text)
              // TODO: Show toast here
            }}
          >
            {phrase.text}
          </div>
        </div>
      )}
      <button
        aria-label="Delete phrase"
        title="Delete phrase"
        onClick={() => onDelete(catId, phrase.id)}
        className={`ml-2 p-2 rounded-md text-xs font-semibold ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
      >
        <Icon icon="mdi:delete" className="w-4 h-4" />
      </button>
    </div>
  )
}
