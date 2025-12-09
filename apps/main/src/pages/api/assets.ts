import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../../db.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  return res.status(200).json(db.assets)
}
