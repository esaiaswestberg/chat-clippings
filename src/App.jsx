import { useEffect, useState } from 'react'
import { translations } from './constants/translations'
import { defaultData } from './constants/defaultData'
import { loadData, saveData, loadTheme, saveTheme, loadLanguage, saveLanguage, loadPrivacyFooter, savePrivacyFooter } from './services/storage'
import { uid } from './utils/uid'
import Header from './components/Header/Header'
import BackgroundAnimation from './components/BackgroundAnimation/BackgroundAnimation'
import GroupCard from './components/GroupCard/GroupCard'
import AddPhraseDialog from './components/dialogs/AddPhraseDialog'
import AddGroupDialog from './components/dialogs/AddGroupDialog'
import ConfirmDialog from './components/dialogs/ConfirmDialog'

export default function App() {
  const [groups, setGroups] = useState(() => loadData() ?? defaultData)
  const [dialogCatId, setDialogCatId] = useState(null)
  const [isDark, setIsDark] = useState(() => loadTheme())
  const [language, setLanguage] = useState(() => loadLanguage())
  const [confirmDialog, setConfirmDialog] = useState(null) // { message, onConfirm }
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false)
  const [isPrivacyFooterVisible, setIsPrivacyFooterVisible] = useState(() => loadPrivacyFooter())

  const t = translations[language] || translations.en

  useEffect(() => {
    saveData(groups)
  }, [groups])

  useEffect(() => {
    saveTheme(isDark)
  }, [isDark])

  useEffect(() => {
    saveLanguage(language)
  }, [language])

  useEffect(() => {
    savePrivacyFooter(isPrivacyFooterVisible)
  }, [isPrivacyFooterVisible])

  function toggleTheme() {
    setIsDark(prev => !prev)
  }

  function togglePrivacyFooter() {
    setIsPrivacyFooterVisible(prev => !prev)
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
        setConfirmDialog(null)
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
        setConfirmDialog(null)
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
      <main className="flex-1 p-3 sm:p-6 flex flex-col gap-3 sm:gap-6 relative">
        <BackgroundAnimation isDark={isDark} />

        <Header 
          isDark={isDark}
          language={language}
          onToggleTheme={toggleTheme}
          onLanguageChange={setLanguage}
          onAddGroup={promptAddGroup}
          t={t}
        />

        <section className={`relative z-10 rounded-xl sm:rounded-2xl flex-1 overflow-hidden ${isDark ? 'glass border border-purple-500/20' : 'glass-light border border-indigo-200/50'} shadow-2xl animate-slide-in`} style={{ animationDelay: '0.1s' }}>
          <div className="h-full overflow-auto p-2 sm:p-4">
            <div className="grid gap-3 sm:gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {groups.map((group, idx) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  index={idx}
                  onAddPhrase={(groupId) => setDialogCatId(groupId)}
                  onDeleteGroup={deleteGroup}
                  onDeletePhrase={deletePhrase}
                  onUpdatePhrase={updatePhrase}
                  onRenameGroup={renameGroup}
                  isDark={isDark}
                  t={t}
                />
              ))}
            </div>
          </div>
        </section>

        {isPrivacyFooterVisible ? (
          <footer className={`relative z-10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 ${isDark ? 'glass border border-purple-500/20' : 'glass-light border border-indigo-200/50'} shadow-lg animate-slide-in`} style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
              <svg 
                className={`w-5 h-5 sm:w-4 sm:h-4 flex-shrink-0 ${isDark ? 'text-purple-400' : 'text-indigo-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <strong className={`${isDark ? 'text-purple-300' : 'text-indigo-600'}`}>Privacy:</strong> All your data is stored locally in your browser. Nothing is ever sent to any server.
              </span>
              <button
                onClick={togglePrivacyFooter}
                className={`ml-2 p-1 rounded-lg transition-all hover:scale-110 ${isDark ? 'hover:bg-purple-500/20 text-purple-300' : 'hover:bg-indigo-100 text-indigo-500'}`}
                title="Hide privacy notice"
              >
                <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </footer>
        ) : (
          <button
            onClick={togglePrivacyFooter}
            className={`fixed bottom-4 right-4 z-20 p-3 rounded-full ${isDark ? 'glass border border-purple-500/20' : 'glass-light border border-indigo-200/50'} shadow-lg transition-all hover:scale-110 animate-slide-in`}
            title="Show privacy notice"
            style={{ animationDelay: '0.2s' }}
          >
            <svg 
              className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-indigo-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </button>
        )}
      </main>

      <AddPhraseDialog
        isOpen={dialogCatId !== null}
        phrase=""
        onAdd={(text) => {
          addPhrase(dialogCatId, text)
          setDialogCatId(null)
        }}
        onCancel={() => setDialogCatId(null)}
        isDark={isDark}
        t={t}
      />

      <AddGroupDialog
        isOpen={addGroupDialogOpen}
        onAdd={(name) => {
          addGroup(name)
          setAddGroupDialogOpen(false)
        }}
        onCancel={() => setAddGroupDialogOpen(false)}
        isDark={isDark}
        t={t}
      />

      <ConfirmDialog
        isOpen={confirmDialog !== null}
        message={confirmDialog?.message || ''}
        onConfirm={confirmDialog?.onConfirm || (() => {})}
        onCancel={() => setConfirmDialog(null)}
        isDark={isDark}
        t={t}
      />
    </div>
  )
}
