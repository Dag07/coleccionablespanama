import { useEffect, useMemo, useState } from 'react'
import { AssetType } from 'coleccionablespanama/shared/types'
import classNames from 'classnames'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Modal } from 'coleccionablespanama/shared/modals'

interface BidPanelProps {
  asset: AssetType
}

interface BidEntry {
  bidder: string
  amount: number
  created_at: string
}

const BidPanel = ({ asset }: BidPanelProps): JSX.Element => {
  const isAuction = asset.billing_type === 'auction'
  const [bidAmount, setBidAmount] = useState('')
  const [bids, setBids] = useState<BidEntry[]>([])
  const [error, setError] = useState('')
  const [now, setNow] = useState<Date>(new Date())
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  const buyNowPrice = 6000
  const startingBid = asset.current_bid ?? asset.price ?? 0

  const auctionEndsAt = useMemo(() => {
    if (asset.auction_ends_at) return new Date(asset.auction_ends_at)
    const fallback = new Date()
    fallback.setDate(fallback.getDate() + 12)
    return fallback
  }, [asset.auction_ends_at])

  const currentBid = bids[0]?.amount ?? startingBid
  const minIncrement = 10
  const nextBid = currentBid + minIncrement

  const timeLeft = useMemo(() => {
    if (!isAuction)
      return { text: '', days: 0, hours: 0, minutes: 0, seconds: 0 }

    const diff = auctionEndsAt.getTime() - now.getTime()

    if (diff <= 0) {
      return {
        text: 'Subasta finalizada',
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    let text = ''
    if (days > 0) text += `${days}d `
    if (hours > 0 || days > 0) text += `${hours}h `
    if (days === 0) text += `${minutes}m ${seconds}s`

    return { text: text.trim(), days, hours, minutes, seconds }
  }, [auctionEndsAt, isAuction, now])

  useEffect(() => {
    if (!isAuction) return

    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [isAuction])

  const onPlaceBid = () => {
    setShowSignUpModal(true)
  }

  const handleBuyNow = () => {
    setShowSignUpModal(true)
  }

  return (
    <div className="flex w-full flex-col items-start justify-center space-y-6 rounded-2xl border-t border-gray-100 bg-white p-6 text-slate-900 shadow-md drop-shadow-2xl dark:border-neutral-700 dark:bg-neutral-800 dark:text-slate-200">
      <div className="flex items-center space-x-3">
        <span
          className={classNames(
            'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
            isAuction
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200'
              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
          )}
        >
          {isAuction ? 'Subasta' : 'Compra inmediata'}
        </span>
        {isAuction && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Termina en {timeLeft.text}
          </span>
        )}
      </div>

      {isAuction ? (
        <div className="w-full space-y-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oferta actual
            </p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-semibold">{currentBid}</span>
              {asset.ticker && (
                <span className="text-lg font-semibold text-gray-500">
                  {asset.ticker}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mínimo siguiente: {nextBid} {asset.ticker || ''}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Ingresa tu oferta
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={bidAmount}
                min={nextBid}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-transparent p-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-100"
                placeholder={`≥ ${nextBid}`}
              />
              <button
                type="button"
                onClick={onPlaceBid}
                className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500"
              >
                Ofrecer
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {bids.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Ofertas recientes
              </p>
              <ul className="space-y-2">
                {bids.map((bid) => (
                  <li
                    key={`${bid.bidder}-${bid.created_at}-${bid.amount}`}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm dark:border-neutral-700"
                  >
                    <span className="font-semibold">{bid.amount}</span>
                    <span className="text-gray-500">{bid.bidder}</span>
                    <span className="text-gray-400">
                      {formatDistanceToNow(new Date(bid.created_at), {
                        addSuffix: true,
                        locale: es
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Disponible para compra directa.
          </p>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-semibold">{buyNowPrice}</span>
            {asset.ticker && (
              <span className="text-lg font-semibold text-gray-500">
                {asset.ticker}
              </span>
            )}
          </div>
          <button
            onClick={handleBuyNow}
            className="w-full rounded-full bg-blue-600 px-6 py-4 text-base font-bold text-white shadow hover:bg-blue-500"
          >
            Comprar ahora
          </button>
        </div>
      )}

      {buyNowPrice && isAuction && (
        <div className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-900/30 dark:text-blue-50">
          Compra inmediata disponible por {buyNowPrice} {asset.ticker || ''}
        </div>
      )}

      <Modal
        open={showSignUpModal}
        onDismiss={() => setShowSignUpModal(false)}
        title="Registro requerido"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Para poder realizar compras u ofertas, necesitas registrarte en
            nuestra plataforma.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSignUpModal(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setShowSignUpModal(false)
                // TODO: Navigate to signup page
                alert('Redirigiendo a registro...')
              }}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Registrarse gratis
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BidPanel
