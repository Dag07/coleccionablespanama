import api from '../../index'
import {
  PutCollectionParamsType,
  PutCollectionResponseType,
  GetCollectionAssetsBySlugResponseType,
  GetCollectionAssetsBySlugParamsType,
  GetCollectionResponseType,
  GetCollectionParamsType
} from 'coleccionablespanama/shared/types'

const getCollection = async (
  params?: GetCollectionParamsType
): Promise<GetCollectionResponseType> => {
  // JSON Server: fetch all collections and filter by slug
  const { data } = await api.get('/collections')

  if (Array.isArray(data)) {
    const collection = data.find((c) => c.slug === params?.slug)
    if (collection) {
      return { record: collection }
    }
    throw new Error('Collection not found')
  }

  return data
}

const getCollectionAssetsBySlug = async (
  params?: GetCollectionAssetsBySlugParamsType
): Promise<GetCollectionAssetsBySlugResponseType> => {
  // JSON Server: fetch collection and all assets, then combine
  const [collectionsRes, assetsRes] = await Promise.all([
    api.get('/collections'),
    api
      .get('/collections')
      .catch((error) =>
        (error as any)?.response?.status === 404
          ? api.get('/assets')
          : Promise.reject(error)
      )
  ])

  if (Array.isArray(collectionsRes.data) && Array.isArray(assetsRes.data)) {
    const collection = collectionsRes.data.find((c) => c.slug === params?.slug)

    if (!collection) {
      throw new Error('Collection not found')
    }

    // Filter assets by collection blockchain or tags (simple matching)
    const collectionAssets = assetsRes.data.filter(
      (asset) =>
        asset.blockchain === collection.blockchain ||
        asset.tags?.some((tag) => collection.tags?.includes(tag))
    )

    const { limit = 20, offset = 0 } = params || {}

    return {
      record: {
        slug: collection.slug,
        token: collection.token,
        assets: {
          records: collectionAssets,
          paginate: {
            count: collectionAssets.length,
            limit,
            offset
          }
        }
      }
    }
  }

  return assetsRes.data
}

const putCollection = async (
  params?: PutCollectionParamsType
): Promise<PutCollectionResponseType> => {
  const { data } = await api.put(`/collections/${params?.slug}`, {
    collection: params?.collection
  })

  return data
}

export { getCollection, getCollectionAssetsBySlug, putCollection }
