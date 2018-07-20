// @flow
import createRedis from '../utils/createRedis'

const redis = createRedis({
  keyPrefix: process.env.REDIS_CACHE_PREFIX
})

export default redis
