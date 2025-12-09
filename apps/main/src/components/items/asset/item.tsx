import Link from 'next/link'
import Image from 'next/image'
import { AssetType } from 'coleccionablespanama/shared/types'
import { getCategorySlug } from '../../../utils/categories'

type Props = {
  item: AssetType
}

/**
 * @name Item component for Asset
 * @param {Props} props
 * @param {AssetProps} props.item
 * @returns {JSX.Element}
 * @example
 * <Item item={item} />
 */
const Item = ({ item }: Props): JSX.Element => {
  const categorySlug = getCategorySlug(item.blockchain)

  // Format price with commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const isAuction = item.billing_type === 'auction'

  // Calculate time remaining for auctions
  const getTimeRemaining = () => {
    if (!item.auction_ends_at) return null
    
    const endDate = new Date(item.auction_ends_at)
    const now = new Date()
    const diffMs = endDate.getTime() - now.getTime()
    
    if (diffMs <= 0) return 'Finalizada'
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    } else {
      return `${diffMinutes}m`
    }
  }

  const timeRemaining = isAuction ? getTimeRemaining() : null

  return (
    <div className="item">
      <div className="item-wrapper">
        <div className="item-block">
          <div className="item-card">
            <Link
              href={'/items/[category]/[slug]'}
              as={`/items/${categorySlug}/${encodeURIComponent(
                item.slug as string
              )}`}
              className="item-card-link"
            >
              <>
                <div className="thumbnail-wrapper asset">
                  <div
                    className="thumbnail"
                    style={{
                      backgroundColor: item.media?.dominant_color || undefined
                    }}
                  >
                    <Image
                      src={item.media?.src}
                      width="300"
                      height="300"
                      alt={item.name}
                      style={{ clipPath: 'inset(0.5px)' }}
                      unoptimized
                    />
                  </div>
                </div>
                <div className="item-card-body">
                  <div className="item-card-content">
                    <div className="item-info">
                      <div className="item-card-title">
                        <span>{item.name}</span>
                      </div>
                      <div className={`item-price ${isAuction ? 'auction' : 'buy-now'}`}>
                        {isAuction ? (
                          <>
                            <div className="price-section">
                              <span className="price-label">Oferta actual</span>
                              <span className="price-value">${formatPrice(item.price)}</span>
                            </div>
                            {timeRemaining && (
                              <span className="time-remaining">{timeRemaining}</span>
                            )}
                          </>
                        ) : (
                          <span className="price-value">${formatPrice(item.price)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="item-card-action">
                    <button type="button">
                      {isAuction ? 'Ofertar' : 'Comprar'}
                    </button>
                  </div>
                </div>
              </>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
