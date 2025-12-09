import api from '../../index'
import {
  AssetInfoResponseType,
  GetAssetResponseType,
  AssetPutParamsType,
  AssetOwnersResponseType,
  AssetPutResponseType
} from 'coleccionablespanama/shared/types'

export const getAsset = async (
  slug?: string
): Promise<GetAssetResponseType> => {
  // JSON Server: fetch all assets and filter by slug
  const fetchItems = async () => {
    try {
      return await api.get('/items')
    } catch (error: unknown) {
      const status = (error as any)?.response?.status
      if (status === 404) {
        return await api.get('/assets')
      }
      throw error
    }
  }

  const { data } = await fetchItems()

  if (Array.isArray(data)) {
    const asset = data.find((a) => a.slug === slug)
    if (asset) {
      return { record: asset }
    }
    throw new Error('Asset not found')
  }

  return data
}

const getAssetOwners = async (
  slug?: string
): Promise<AssetOwnersResponseType> => {
  // Mock: return empty owners for now
  return {
    record: {
      token: '',
      slug: slug || '',
      creator: {
        first_name: '',
        last_name: '',
        username: '',
        bio: null,
        website: null,
        facebook: null,
        twitter: null,
        language: 'es',
        created_at: new Date().toISOString()
      },
      owners: []
    }
  }
}

const getAssetInfo = async (slug?: string): Promise<AssetInfoResponseType> => {
  // Mock: return basic asset info
  return {
    record: {
      blockchain: 'Pokémon TCG',
      contract_address: '',
      slug: slug || '',
      token: '',
      token_id: 0,
      token_standard: ''
    }
  }
}

export const putAsset = async (
  params?: AssetPutParamsType
): Promise<AssetPutResponseType> => {
  const update = async (endpoint: string) =>
    api.put(`${endpoint}/${params?.slug}`, {
      asset: params?.asset
    })

  try {
    const { data } = await update('/assets')
    return data
  } catch (error: unknown) {
    const status = (error as any)?.response?.status
    if (status === 404) {
      const { data } = await update('/assets')
      return data
    }
    throw error
  }

  // Fallback just in case
  // eslint-disable-next-line no-unreachable
  return { record: params?.asset as any }
}

export { getAssetOwners, getAssetInfo }
