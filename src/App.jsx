import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

const STORAGE_KEY = 'chat-clippings-data-v1'
const THEME_KEY = 'chat-clippings-theme'
const LANGUAGE_KEY = 'chat-clippings-language'

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

function loadLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'en'
}

function saveLanguage(lang) {
  localStorage.setItem(LANGUAGE_KEY, lang)
}

const translations = {
  en: {
    appTitle: 'Chat Clippings',
    appSubtitle: 'Organize your common phrases',
    addGroup: 'Add Group',
    light: 'Light',
    dark: 'Dark',
    addNewGroup: 'Add New Group',
    addNewPhrase: 'Add New Phrase',
    confirmDeletion: 'Confirm Deletion',
    deleteGroupConfirm: (name) => `Are you sure you want to delete the "${name}" group and all its phrases?`,
    deleteGroupConfirmGeneric: 'Are you sure you want to delete this group?',
    deletePhraseConfirm: 'Are you sure you want to delete this phrase?',
    delete: 'Delete',
    cancel: 'Cancel',
    add: 'Add',
    addPhrase: 'Add phrase',
    deleteGroup: 'Delete group',
    enterGroupName: 'Enter group name...',
    enterPhrase: 'Enter your phrase here...',
    noPhrasesYet: 'No phrases yet. Click + to add one!',
    clickToCopy: 'Click to copy • Double-click to edit',
    copied: 'Copied!',
    deletePhrase: 'Delete phrase',
    switchLanguage: 'Switch language'
  },
  sv: {
    appTitle: 'Chat Klipp',
    appSubtitle: 'Organisera dina vanliga fraser',
    addGroup: 'Lägg till Grupp',
    light: 'Ljus',
    dark: 'Mörk',
    addNewGroup: 'Lägg till Ny Grupp',
    addNewPhrase: 'Lägg till Ny Fras',
    confirmDeletion: 'Bekräfta Borttagning',
    deleteGroupConfirm: (name) => `Är du säker på att du vill ta bort gruppen "${name}" och alla dess fraser?`,
    deleteGroupConfirmGeneric: 'Är du säker på att du vill ta bort denna grupp?',
    deletePhraseConfirm: 'Är du säker på att du vill ta bort denna fras?',
    delete: 'Ta bort',
    cancel: 'Avbryt',
    add: 'Lägg till',
    addPhrase: 'Lägg till fras',
    deleteGroup: 'Ta bort grupp',
    enterGroupName: 'Ange gruppnamn...',
    enterPhrase: 'Skriv din fras här...',
    noPhrasesYet: 'Inga fraser än. Klicka på + för att lägga till en!',
    clickToCopy: 'Klicka för att kopiera • Dubbelklicka för att redigera',
    copied: 'Kopierad!',
    deletePhrase: 'Ta bort fras',
    switchLanguage: 'Byt språk'
  },
  no: {
    appTitle: 'Chat Utklipp',
    appSubtitle: 'Organiser dine vanlige fraser',
    addGroup: 'Legg til Gruppe',
    light: 'Lys',
    dark: 'Mørk',
    addNewGroup: 'Legg til Ny Gruppe',
    addNewPhrase: 'Legg til Ny Frase',
    confirmDeletion: 'Bekreft Sletting',
    deleteGroupConfirm: (name) => `Er du sikker på at du vil slette gruppen "${name}" og alle fraser?`,
    deleteGroupConfirmGeneric: 'Er du sikker på at du vil slette denne gruppen?',
    deletePhraseConfirm: 'Er du sikker på at du vil slette denne frasen?',
    delete: 'Slett',
    cancel: 'Avbryt',
    add: 'Legg til',
    addPhrase: 'Legg til frase',
    deleteGroup: 'Slett gruppe',
    enterGroupName: 'Skriv inn gruppenavn...',
    enterPhrase: 'Skriv inn frasen din her...',
    noPhrasesYet: 'Ingen fraser ennå. Klikk + for å legge til en!',
    clickToCopy: 'Klikk for å kopiere • Dobbeltklikk for å redigere',
    copied: 'Kopiert!',
    deletePhrase: 'Slett frase',
    switchLanguage: 'Bytt språk'
  }
}

const defaultData = [
  { id: uid(), name: 'Greetings', phrases: [{ id: uid(), text: 'Hello!' }, { id: uid(), text: 'Hi there' }] },
  { id: uid(), name: 'Sign-offs', phrases: [{ id: uid(), text: 'Take care' }, { id: uid(), text: 'Thanks!' }] }
]

export default function App() {
  const [groups, setGroups] = useState(() => loadData() ?? defaultData)
  const [dialogCatId, setDialogCatId] = useState(null)
  const [dialogPhrase, setDialogPhrase] = useState('')
  const [isDark, setIsDark] = useState(() => loadTheme())
  const [language, setLanguage] = useState(() => loadLanguage())
  const [editingCatId, setEditingCatId] = useState(null)
  const [editingCatName, setEditingCatName] = useState('')
  const [confirmDialog, setConfirmDialog] = useState(null) // { message, onConfirm }
  const [confirmClosing, setConfirmClosing] = useState(false)
  const [confirmOpening, setConfirmOpening] = useState(false)
  const [dialogClosing, setDialogClosing] = useState(false)
  const [dialogOpening, setDialogOpening] = useState(false)
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false)
  const [addGroupClosing, setAddGroupClosing] = useState(false)
  const [addGroupOpening, setAddGroupOpening] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  const t = translations[language] || translations.en

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' }
  ]

  useEffect(() => {
    saveData(groups)
  }, [groups])

  useEffect(() => {
    saveTheme(isDark)
  }, [isDark])

  useEffect(() => {
    saveLanguage(language)
  }, [language])

  // Trigger enter animation when confirm dialog opens
  useEffect(() => {
    if (confirmDialog && !confirmClosing) {
      setConfirmOpening(true)
    } else {
      setConfirmOpening(false)
    }
  }, [confirmDialog, confirmClosing])

  // Trigger enter animation when add phrase dialog opens
  useEffect(() => {
    if (dialogCatId !== null && !dialogClosing) {
      setDialogOpening(true)
    } else {
      setDialogOpening(false)
    }
  }, [dialogCatId, dialogClosing])

  // Trigger enter animation when add group dialog opens
  useEffect(() => {
    if (addGroupDialogOpen && !addGroupClosing) {
      setAddGroupOpening(true)
    } else {
      setAddGroupOpening(false)
    }
  }, [addGroupDialogOpen, addGroupClosing])

  function toggleTheme() {
    setIsDark(prev => !prev)
  }

  function closeConfirmDialog() {
    setConfirmClosing(true)
    setTimeout(() => {
      setConfirmDialog(null)
      setConfirmClosing(false)
    }, 200) // Match animation duration
  }

  function closeAddPhraseDialog() {
    setDialogClosing(true)
    setTimeout(() => {
      setDialogCatId(null)
      setDialogPhrase('')
      setDialogClosing(false)
    }, 200) // Match animation duration
  }

  function closeAddGroupDialog() {
    setAddGroupClosing(true)
    setTimeout(() => {
      setAddGroupDialogOpen(false)
      setNewGroupName('')
      setAddGroupClosing(false)
    }, 200) // Match animation duration
  }

  function addGroup(name) {
    const n = (name || '').trim()
    if (!n) return
    const c = { id: uid(), name: n, phrases: [] }
    setGroups(prev => [...prev, c])
  }

  function promptAddGroup() {
    setAddGroupDialogOpen(true)
  }

  function deleteGroup(id) {
    const group = groups.find(c => c.id === id)
    const message = group
      ? t.deleteGroupConfirm(group.name)
      : t.deleteGroupConfirmGeneric
    
    setConfirmDialog({
      message,
      onConfirm: () => {
        setGroups(prev => prev.filter(c => c.id !== id))
        closeConfirmDialog()
      }
    })
  }

  function addPhrase(catId, text) {
    const t = (text || '').trim()
    if (!t) return
    setGroups(prev => prev.map(c => c.id === catId ? { ...c, phrases: [...c.phrases, { id: uid(), text: t }] } : c))
  }

  function deletePhrase(catId, phraseId) {
    setConfirmDialog({
      message: t.deletePhraseConfirm,
      onConfirm: () => {
        setGroups(prev => prev.map(c => c.id === catId ? { ...c, phrases: c.phrases.filter(p => p.id !== phraseId) } : c))
        closeConfirmDialog()
      }
    })
  }

  function updatePhrase(catId, phraseId, text) {
    setGroups(prev => prev.map(c => c.id === catId ? { ...c, phrases: c.phrases.map(p => p.id === phraseId ? { ...p, text } : p) } : c))
  }

  function renameGroup(id, newName) {
    setGroups(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c))
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'dark bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <main className="flex-1 p-6 flex flex-col gap-6 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-purple-500' : 'bg-indigo-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`}></div>
          <div className={`absolute top-40 right-10 w-72 h-72 ${isDark ? 'bg-pink-500' : 'bg-pink-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{ animationDelay: '2s' }}></div>
          <div className={`absolute -bottom-8 left-20 w-72 h-72 ${isDark ? 'bg-indigo-500' : 'bg-purple-400'} rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse`} style={{ animationDelay: '4s' }}></div>
        </div>

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
              onClick={promptAddGroup}
            >
              <span className="flex items-center gap-2">
                <Icon icon="mdi:plus-circle" className="w-5 h-5" />
                {t.addGroup}
              </span>
            </button>
            <div className="relative z-50">
              <button 
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDark 
                    ? 'glass text-white border border-purple-500/30 hover:border-purple-400/50' 
                    : 'glass-light text-gray-700 border border-indigo-200 hover:border-indigo-300'
                }`}
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                title={t.switchLanguage}
              >
                <span className="flex items-center gap-2">
                  <Icon icon="mdi:web" className="w-5 h-5" />
                  {language.toUpperCase()}
                </span>
              </button>
              {languageDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLanguageDropdownOpen(false)}
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
                          setLanguage(lang.code)
                          setLanguageDropdownOpen(false)
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
            <button 
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isDark 
                  ? 'glass text-white border border-purple-500/30 hover:border-purple-400/50' 
                  : 'glass-light text-gray-700 border border-indigo-200 hover:border-indigo-300'
              }`}
              onClick={toggleTheme}
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
          </div>
        </header>

        <section className={`relative z-10 rounded-2xl flex-1 overflow-hidden ${isDark ? 'glass border border-purple-500/20' : 'glass-light border border-indigo-200/50'} shadow-2xl animate-slide-in`} style={{ animationDelay: '0.1s' }}>
          <div className="h-full overflow-auto p-4">
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(510px, 1fr))' }}>
              {groups.map((cat, idx) => (
                <div 
                  key={cat.id} 
                  className={`group relative rounded-xl border transition-all duration-300 transform hover:scale-[1.02] ${
                    isDark 
                      ? 'glass border-purple-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20' 
                      : 'bg-white/80 backdrop-blur-sm border-indigo-200/40 hover:border-indigo-300/60 hover:shadow-lg hover:shadow-indigo-500/10'
                  } animate-slide-in`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                > 
                  {/* Category Header */}
                  <div className={`flex gap-2 items-center p-4 pb-3 border-b ${isDark ? 'border-purple-500/20' : 'border-indigo-200/40'}`}>
                    <div className="flex-1 flex items-center">
                      {editingCatId === cat.id ? (
                        <input
                          className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition-all ${
                            isDark 
                              ? 'bg-gray-800/50 text-gray-100 border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20' 
                              : 'bg-white text-gray-900 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                          } outline-none font-semibold text-lg`}
                          value={editingCatName}
                          onChange={e => setEditingCatName(e.target.value)}
                          onBlur={() => {
                            const v = (editingCatName || '').trim()
                            if (v) renameGroup(cat.id, v)
                            setEditingCatId(null)
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              const v = (editingCatName || '').trim()
                              if (v) renameGroup(cat.id, v)
                              setEditingCatId(null)
                            } else if (e.key === 'Escape') {
                              setEditingCatId(null)
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div
                          className={`flex-1 px-4 py-2.5 font-bold text-lg cursor-text rounded-lg transition-colors ${
                            isDark 
                              ? 'text-purple-200 hover:bg-purple-900/20' 
                              : 'text-indigo-900 hover:bg-indigo-50/50'
                          }`}
                          onDoubleClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name) }}
                        >
                          {cat.name}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        aria-label={t.addPhrase}
                        title={t.addPhrase}
                        className={`p-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 ${
                          isDark 
                            ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md hover:shadow-purple-500/50' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/50'
                        }`}
                        onClick={() => { setDialogCatId(cat.id); setDialogPhrase('') }}
                      >
                        <Icon icon="mdi:plus" className="w-5 h-5" />
                      </button>
                      <button
                        aria-label={t.deleteGroup}
                        title={t.deleteGroup}
                        onClick={() => deleteGroup(cat.id)}
                        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg font-semibold transform hover:scale-110 ${
                          isDark 
                            ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' 
                            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        <Icon icon="mdi:delete" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Phrases */}
                  <div className="p-3">
                    {cat.phrases.length === 0 ? (
                      <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Icon icon="mdi:text-box-outline" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">{t.noPhrasesYet}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {cat.phrases.map((p, idx) => (
                          <React.Fragment key={p.id}>
                            <PhraseRow phrase={p} catId={cat.id} onDelete={deletePhrase} onUpdate={updatePhrase} isDark={isDark} t={t} />
                            {idx < cat.phrases.length - 1 && (
                              <hr className={`${isDark ? 'border-purple-500/20' : 'border-indigo-200/40'}`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Dialog for adding phrase */}
      {dialogCatId !== null && (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${
          dialogClosing ? 'opacity-0' : dialogOpening ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`rounded-2xl shadow-2xl p-6 min-w-[420px] max-w-[90vw] flex flex-col gap-4 border transition-all duration-200 ${
            isDark 
              ? 'glass border-purple-500/30' 
              : 'bg-white border-indigo-200'
          } ${
            dialogClosing 
              ? 'opacity-0 scale-95 translate-y-4' 
              : dialogOpening 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                <Icon icon="mdi:text-box-plus" className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-purple-200' : 'text-indigo-900'}`}>{t.addNewPhrase}</h2>
            </div>
            <textarea
              className={`w-full p-4 border-2 rounded-xl resize-y min-h-[120px] transition-all outline-none ${
                isDark 
                  ? 'bg-gray-800/50 text-gray-100 border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20' 
                  : 'bg-gray-50 text-gray-900 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
              placeholder={t.enterPhrase}
              value={dialogPhrase}
              autoFocus
              onChange={e => setDialogPhrase(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') closeAddPhraseDialog()
              }}
            />
            <div className="flex gap-3 justify-end mt-2">
              <button
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50'
                }`}
                onClick={() => {
                  if (dialogPhrase.trim()) {
                    addPhrase(dialogCatId, dialogPhrase)
                    closeAddPhraseDialog()
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon icon="mdi:check" className="w-5 h-5" />
                  {t.add}
                </span>
              </button>
              <button
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={closeAddPhraseDialog}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Dialog */}
      {addGroupDialogOpen && (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${
          addGroupClosing ? 'opacity-0' : addGroupOpening ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`rounded-2xl shadow-2xl p-6 min-w-[420px] max-w-[90vw] flex flex-col gap-4 border transition-all duration-200 ${
            isDark 
              ? 'glass border-purple-500/30' 
              : 'bg-white border-indigo-200'
          } ${
            addGroupClosing 
              ? 'opacity-0 scale-95 translate-y-4' 
              : addGroupOpening 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-600' : 'bg-indigo-600'}`}>
                <Icon icon="mdi:folder-plus" className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-purple-200' : 'text-indigo-900'}`}>{t.addNewGroup}</h2>
            </div>
            <input
              type="text"
              className={`w-full p-4 border-2 rounded-xl transition-all outline-none ${
                isDark 
                  ? 'bg-gray-800/50 text-gray-100 border-purple-500/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20' 
                  : 'bg-gray-50 text-gray-900 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              }`}
              placeholder={t.enterGroupName}
              value={newGroupName}
              autoFocus
              onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newGroupName.trim()) {
                  addGroup(newGroupName)
                  closeAddGroupDialog()
                } else if (e.key === 'Escape') {
                  closeAddGroupDialog()
                }
              }}
            />
            <div className="flex gap-3 justify-end mt-2">
              <button
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50'
                }`}
                onClick={() => {
                  if (newGroupName.trim()) {
                    addGroup(newGroupName)
                    closeAddGroupDialog()
                  }
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon icon="mdi:check" className="w-5 h-5" />
                  {t.add}
                </span>
              </button>
              <button
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
onClick={closeAddGroupDialog}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${
          confirmClosing ? 'opacity-0' : confirmOpening ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`rounded-2xl shadow-2xl p-6 min-w-[420px] max-w-[90vw] flex flex-col gap-4 border transition-all duration-200 ${
            isDark 
              ? 'glass border-purple-500/30' 
              : 'bg-white border-indigo-200'
          } ${
            confirmClosing 
              ? 'opacity-0 scale-95 translate-y-4' 
              : confirmOpening 
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
              {confirmDialog.message}
            </p>
            <div className="flex gap-3 justify-end mt-2">
              <button
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDark 
                    ? 'bg-red-600 text-white shadow-lg hover:bg-red-500 hover:shadow-red-500/50' 
                    : 'bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-red-500/50'
                }`}
                onClick={confirmDialog.onConfirm}
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
                onClick={closeConfirmDialog}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PhraseRow({ phrase, catId, onDelete, onUpdate, isDark, t }) {
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
