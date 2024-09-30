'use strict'

const { promisify } = require('util')
const { reservationInventory } = require('../model/repositories/inventory.repo')
const { redisClient } =  require('../dbs/init.redis')

const  pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async(productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`
  const retryTime = 10
  const expiredTime = 3000

  for(let i = 0; i < retryTime; i++) {
    const result = await setnxAsync(key, expiredTime)
    if(result === 1) {
      // update inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId
      })

      if(isReservation.modifiedCount) {
        await pExpire(key, expiredTime)
        return key
      }
      return null
    }else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async(keylock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return  await delAsyncKey(keylock)
}

module.exports = {
  releaseLock,
  acquireLock
}
