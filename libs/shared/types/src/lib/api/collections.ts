import { ApiResponseGeneric, PaginateWrapperType } from '../common'
import { CollectionType } from '../collection'

export type GetCollectionsResponseType = PaginateWrapperType &
  ApiResponseGeneric<CollectionType[]>

export type GetCollectionsFiltersParamsType = {
  blockchain?: string[]
  cached_assets_count?: {
    ge?: number | string
    le?: number | string
  }
}

export type GetCollectionsParamsType = {
  limit?: number
  offset?: number
  filters?: GetCollectionsFiltersParamsType
  sort?: string
}
