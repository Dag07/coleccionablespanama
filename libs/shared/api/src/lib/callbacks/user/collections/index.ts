import api from '../../../index'
import {
  GetUserCollectionsParamsType,
  GetUserCollectionsResponseType
} from 'coleccionablespanama/shared/types'

const getUserCollections = async (
  props?: GetUserCollectionsParamsType
): Promise<GetUserCollectionsResponseType> => {
  // Mock: return empty paginated response for user collections
  return {
    records: [],
    paginate: {
      count: 0,
      limit: props?.params?.limit || 20,
      offset: props?.params?.offset || 0
    }
  }
}

export default getUserCollections
