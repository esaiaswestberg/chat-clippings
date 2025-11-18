import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'

export default function AddPhraseDialog({ isOpen, phrase, onAdd, onCancel, isDark, t }) {
  const [closing, setClosing] = useState(false)
  const [opening, setOpening] = useState(false)
  const [dialogPhrase, setDialogPhrase] = useState(phrase)

  useEffect(() => {
    setDialogPhrase(phrase)
  }, [phrase])

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
      setDialogPhrase('')
      setClosing(false)
    }, 200)
  }

  function handleAdd() {
    if (dialogPhrase.trim()) {
      onAdd(dialogPhrase)
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${
      closing ? 'opacity-0' : opening ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`rounded-2xl shadow-2xl p-6 min-w-[420px] max-w-[90vw] flex flex-col gap-4 border transition-all duration-200 ${
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
            if (e.key === 'Escape') handleClose()
          }}
        />
        <div className="flex gap-3 justify-end mt-2">
          <button
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              isDark 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/50' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50'
            }`}
            onClick={handleAdd}
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
            onClick={handleClose}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}
