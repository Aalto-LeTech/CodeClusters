import { Pool } from 'pg'

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
}
