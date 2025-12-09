import api from '../../../index'
import {
  GetUserBundlesParamsType,
  GetUserBundlesResponseType
} from 'coleccionablespanama/shared/types'

const getUserBundles = async (
  props?: GetUserBundlesParamsType
): Promise<GetUserBundlesResponseType> => {
  // Mock: return empty paginated response for user bundles
  return {
    records: [],
    paginate: {
      count: 0,
      limit: props?.params?.limit || 20,
      offset: props?.params?.offset || 0
    }
  }
}

export default getUserBundles
