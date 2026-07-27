export const STORAGE_KEY = 'selected_nomenclatures'

export function writeCookie(ids: string[]) {
  document.cookie = `${STORAGE_KEY}=${JSON.stringify(ids)}; path=/; max-age=${60 * 60 * 24 * 7}`
}

export function clearCookie() {
  document.cookie = `${STORAGE_KEY}=; path=/; max-age=0`
}
