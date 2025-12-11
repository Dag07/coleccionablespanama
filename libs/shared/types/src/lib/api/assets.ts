import {
  ApiResponseGeneric,
  BillingTypeValue,
  PaginateWrapperType
} from '../common'
import { AssetType } from '../asset'

export type GetAssetsResponseType = PaginateWrapperType &
  ApiResponseGeneric<AssetType[]>

export type GetAssetsFiltersParamsType = {
  currency?: string
  slug?: string
  price?: {
    lg?: number | string
    ge?: number | string
    from?: number | string
    to?: number | string
  }
  billing_type?: BillingTypeValue | BillingTypeValue[]
  blockchain?: string | string[]
  subcategory?: string | string[]
  card_type?: string | string[]
  year?: {
    from?: number | string
    to?: number | string
  }
  grade?: {
    from?: number | string
    to?: number | string
  }
  authenticator?: string
  metal?: string | string[]
  country?: string | string[]
}

export type GetAssetsParamsType = {
  limit?: number
  offset?: number
  filters?: GetAssetsFiltersParamsType
  sort?: string
}
