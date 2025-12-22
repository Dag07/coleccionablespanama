import type { NextApiRequest, NextApiResponse } from 'next'
import dbData from '../../../db.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return the bundles from db.json
    res.status(200).json(dbData.bundles)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
