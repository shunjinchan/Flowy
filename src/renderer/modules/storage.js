import { getLocalStorage, setLocalStorage } from '../utils/storage'

export function getLastRouter () {
  return getLocalStorage('lastRouter')
}

export function setLastRouter (val) {
  setLocalStorage('lastRouter', val)
}

export function getLastEditNode () {
  return getLocalStorage('lastEditNode')
}

export function setLastEditNode (id) {
  setLocalStorage('lastEditNode', id)
}
