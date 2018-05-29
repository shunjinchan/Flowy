import db from '@/datastore'
import { logger } from '../modules/logger'

export async function findOneAsync (data) {
  try {
    const docs = await db.findOneAsync(data)
    return docs
  } catch (error) {
    logger.error({
      msg: 'error when call method find on async',
      error
    })
    return null
  }
}

export async function insertAsync (data) {
  try {
    const node = await db.insertAsync(data)
    return node
  } catch (error) {
    logger.error({
      msg: 'error when insert node',
      error
    })
    return null
  }
}

export async function updateAsync (query, update, options) {
  try {
    const {
      numAffected,
      affectedDocuments,
      upsert
    } = await db.updateAsync(query, update, options)
    return {
      numAffected,
      affectedDocuments,
      upsert
    }
  } catch (error) {
    logger.error({
      msg: 'error when update node',
      error
    })
    return {}
  }
}

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
