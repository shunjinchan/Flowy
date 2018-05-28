import db from '@/datastore'
import { logger } from '../modules/logger'

/**
 * find node
 * @param {string} _id
 * @returns {object}
 */
export async function getNode (_id) {
  try {
    return await db.findOneAsync({ _id: _id })
  } catch (error) {
    logger.error({
      msg: 'error when find node',
      error
    })
    return null
  }
}

export async function insertNode (data) {
  try {
    return await db.insertAsync(data)
  } catch (error) {
    logger.error({
      msg: 'error when insert node',
      error
    })
    return null
  }
}

export async function getAllNode () {
  try {
    return await db.findAsync({})
  } catch (error) {
    logger.error({
      msg: 'error when get all node',
      error
    })
    return []
  }
}
