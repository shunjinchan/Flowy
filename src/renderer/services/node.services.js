import db from '@/datastore'
import { logger } from '../modules/logger'

/**
 * find node
 * @param {string} _id
 * @returns {object}
 */
export async function getNode ({ _id }) {
  try {
    const node = await db.findOneAsync({ _id: _id })
    return node
  } catch (error) {
    logger.error({
      msg: 'error when find node',
      error
    })
    return null
  }
}

export async function getAllNode () {
  try {
    const nodeList = await db.findAsync({})
    return nodeList
  } catch (error) {
    logger.error({
      msg: 'error when get all node',
      error
    })
    return []
  }
}

export async function deleteNode ({ _id }) {
  try {
    const numDeleted = await db.removeAsync({ _id: _id })
    return numDeleted
  } catch (error) {
    logger.error({
      msg: 'error when delete node',
      error
    })
    return null
  }
}

export async function deleteAllNode () {
  try {
    const numDeleted = await db.removeAsync({}, { multi: true })
    return numDeleted
  } catch (error) {
    logger.error({
      msg: 'error when delete all node',
      error
    })
    return null
  }
}
