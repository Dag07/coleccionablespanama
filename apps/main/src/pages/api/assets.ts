import type { NextApiRequest, NextApiResponse } from 'next'
import dbData from '../../../db.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return the assets from db.json
    res.status(200).json(dbData.assets)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
