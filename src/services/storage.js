import { STORAGE_KEY, THEME_KEY, LANGUAGE_KEY, PRIVACY_FOOTER_KEY } from '../constants/storage'

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadTheme() {
  return localStorage.getItem(THEME_KEY) === 'dark'
}

export function saveTheme(isDark) {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
}

export function loadLanguage() {
  return localStorage.getItem(LANGUAGE_KEY) || 'en'
}

export function saveLanguage(lang) {
  localStorage.setItem(LANGUAGE_KEY, lang)
}

export function loadPrivacyFooter() {
  const value = localStorage.getItem(PRIVACY_FOOTER_KEY)
  return value === null ? true : value === 'true'
}

export function savePrivacyFooter(isVisible) {
  localStorage.setItem(PRIVACY_FOOTER_KEY, isVisible ? 'true' : 'false')
}
