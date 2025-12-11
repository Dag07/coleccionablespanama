import { EditorState } from 'lexical'
import { CollectionType } from './collection'
import { BillingTypeValue } from './common'

export type AssetCreatorType = {
  first_name: string
  last_name: string
  username: string
  bio: string | null
  website: string | null
  facebook: string | null
  twitter: string | null
  language: string
  created_at: string
}

export type AssetCommentsModerationTypes =
  | 'allow_all'
  | 'auto_moderation'
  | 'hold_all'
  | 'disabled'

export type AssetCommentsOrderType = 'interesting' | 'newest'

export type AssetTagType = {
  active: boolean
  name: string
  slug: string
  description: string
  bundles_count: number
  collections_count: number
  assets_count: number
  updated_at: string
  created_at: string
}

export type AssetMediaType = {
  dominant_color: string | null
  file_id: string
  filename: string
  height: number
  mime_type: string
  size: number
  src: string
  storage: string
  type: string
  width: number
}

export type AssetType = {
  token: string
  name: string
  description: string | EditorState | null
  price?: number
  ticker?: string
  media: AssetMediaType
  edit_count?: number
  slug: string
  type?: string
  supply_units?: number
  available_supply_units?: number
  allow_ratings?: boolean
  sensitive_content?: boolean
  contract_address?: string
  token_id?: number
  token_standard?: string
  blockchain?: string
  restrictions?: string
  visibility?: string
  tags: AssetTagType[]
  comments_moderation?: AssetCommentsModerationTypes
  comments_order?: AssetCommentsOrderType
  collection?: CollectionType
  collection_token?: string
  created_at: string
  published_at: string | null
  deleted_at: string | null
  billing_type?: BillingTypeValue
  auction_ends_at?: string | null
  buy_now_price?: number | null
  current_bid?: number | null
  // Card-specific fields
  subcategory?: string
  year?: number
  grade?: number
  authenticator?: string
  card_type?: string[]
  set?: string
  rarity?: string
  // Coin-specific fields
  metal?: string
  coin_type?: string
  country?: string
}
