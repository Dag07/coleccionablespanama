import api from '../../index'
import {
  GetBundleParamsType,
  GetBundleResponseType,
  PutBundleParamsType,
  PutBundleResponseType,
  GetBundleAssetsBySlugResponseType,
  GetBundleAssetsBySlugParamsType
} from 'coleccionablespanama/shared/types'

const getBundle = async (
  params?: GetBundleParamsType
): Promise<GetBundleResponseType> => {
  // JSON Server: fetch all bundles and filter by slug
  const { data } = await api.get('/bundles')

  if (Array.isArray(data)) {
    const bundle = data.find((b) => b.slug === params?.slug)
    if (bundle) {
      return { record: bundle }
    }
    throw new Error('Bundle not found')
  }

  return data
}

const getBundleAssetsBySlug = async (
  params?: GetBundleAssetsBySlugParamsType
): Promise<GetBundleAssetsBySlugResponseType> => {
  // JSON Server: fetch bundle and all assets, then combine
  const [bundlesRes, assetsRes] = await Promise.all([
    api.get('/bundles'),
    api
      .get('/bundles')
      .catch((error) =>
        (error as any)?.response?.status === 404
          ? api.get('/assets')
          : Promise.reject(error)
      )
  ])

  if (Array.isArray(bundlesRes.data) && Array.isArray(assetsRes.data)) {
    const bundle = bundlesRes.data.find((b) => b.slug === params?.slug)

    if (!bundle) {
      throw new Error('Bundle not found')
    }

    // Filter assets by bundle tags or blockchain
    const bundleAssets = assetsRes.data.filter(
      (asset) =>
        asset.blockchain === bundle.blockchain ||
        asset.tags?.some((tag) => bundle.tags?.includes(tag))
    )

    const { limit = 20, offset = 0 } = params || {}
    const paginatedAssets = bundleAssets.slice(offset, offset + limit)

    return {
      record: {
        slug: bundle.slug,
        token: bundle.token,
        assets: paginatedAssets
      }
    }
  }

  return assetsRes.data
}

const putBundle = async (
  params?: PutBundleParamsType
): Promise<PutBundleResponseType> => {
  const { data } = await api.put(`/bundles/${params?.slug}`, {
    bundle: params?.bundle
  })

  return data
}
export { getBundle, getBundleAssetsBySlug, putBundle }
