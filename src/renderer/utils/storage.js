export function isSupportLocalstorage () {
  return !!window.localStorage
}

export function getLocalStorage (key) {
  if (!isSupportLocalstorage) return
  return localStorage.getItem(key)
}

export function setLocalStorage (key, val) {
  if (!isSupportLocalstorage) return
  localStorage.setItem(key, val)
}
