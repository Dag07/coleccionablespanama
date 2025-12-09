import { useEffect } from 'react'
import { useRouter } from 'next/router'

const AssetsRedirect = () => {
  const { replace } = useRouter()

  useEffect(() => {
    replace('/items')
  }, [replace])

  return null
}

export default AssetsRedirect
