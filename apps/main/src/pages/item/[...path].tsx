import { useEffect } from 'react'
import { useRouter } from 'next/router'

const LegacyItemRedirect = () => {
  const router = useRouter()
  const path = (router.query.path as string[]) || []

  useEffect(() => {
    if (!router.isReady || path.length === 0) return
    const target = `/items/${path.join('/')}`
    router.replace(target)
  }, [path, router])

  return null
}

export default LegacyItemRedirect
