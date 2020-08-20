import { Pool, PoolClient } from 'pg'

import { config } from '../common/config'

const pool = new Pool({
  user: config.DB.USER,
  host: config.DB.HOST,
  database: config.DB.NAME,
  password: config.DB.PASS,
  port: config.DB.PORT,
})

export const dbService = {
  async queryOne<T>(query: string, params?: any[]) {
    const { rows } = await pool.query(query, params)
    if (rows.length > 0) {
      return rows[0] as T
    }
    return undefined
  },
  async queryMany<T>(query: string, params?: any[]) {
    const { rows } = await pool.query(query, params)
    return rows as T[]
  },
  async executeAsTransaction<T>(transactionFn: (client: PoolClient) => Promise<any>) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const results = await transactionFn(client)
      await client.query('COMMIT')
      return results as T
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  }
}
