import { getLocalStorage, setLocalStorage } from '../utils/storage'

export function getLastRouter () {
  return getLocalStorage('lastRouter')
}

export function setLastRouter (val) {
  return setLocalStorage('lastRouter', val)
}
