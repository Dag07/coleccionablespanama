import api from '../../../index'
import {
  GetUserAssetsParamsType,
  GetUserAssetsResponseType
} from 'coleccionablespanama/shared/types'

const getUserAssets = async (
  props: GetUserAssetsParamsType
): Promise<GetUserAssetsResponseType> => {
  // Mock: return empty paginated response for user assets
  return {
    records: [],
    paginate: {
      count: 0,
      limit: props?.params?.limit || 20,
      offset: props?.params?.offset || 0
    }
  }
}

export default getUserAssets
