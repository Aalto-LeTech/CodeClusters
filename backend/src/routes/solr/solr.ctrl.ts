import { Response, NextFunction } from 'express'
import { solrService } from './solr.service'

import { IAuthRequest } from '../../types/request'

export const reindexSubmissions = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  try {
    const deleted = await solrService.deleteIndexedSubmissions()
    let reindexed
    if (deleted) {
      reindexed = await solrService.reindexSubmissions()
    }
    if (reindexed) {
      res.json(reindexed)
    } else {
      res.status(400).json({ message: 'Reindexing query failed' })
    }
  } catch (err) {
    next(err)
  }
}
