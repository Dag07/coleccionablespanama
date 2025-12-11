import { useRouter } from 'next/router'
import { getAsset } from 'coleccionablespanama/shared/api'
import { useEffect, useState } from 'react'
import { AssetType } from 'coleccionablespanama/shared/types'

export const Info = () => {
  const param = useRouter()
  const { slug } = param.query
  const [asset, setAsset] = useState<AssetType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAsset = async () => {
      if (slug) {
        try {
          const data = await getAsset(slug as string)
          setAsset(data.record)
        } catch (error) {
          console.error('Error loading asset info:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchAsset()
  }, [slug])

  if (isLoading) {
    return <span>Cargando...</span>
  }

  if (!asset) {
    return <span>No se encontró información</span>
  }

  const infoFields = [
    { label: 'Categoría', value: asset.blockchain },
    // Card-specific fields
    ...(asset.subcategory
      ? [{ label: 'Subcategoría', value: asset.subcategory }]
      : []),
    ...(asset.card_type &&
    Array.isArray(asset.card_type) &&
    asset.card_type.length > 0
      ? [{ label: 'Tipo de Carta', value: asset.card_type.join(', ') }]
      : []),
    ...(asset.set ? [{ label: 'Set', value: asset.set }] : []),
    ...(asset.rarity ? [{ label: 'Rareza', value: asset.rarity }] : []),
    // Coin-specific fields
    ...(asset.coin_type
      ? [{ label: 'Tipo de Moneda', value: asset.coin_type }]
      : []),
    ...(asset.metal ? [{ label: 'Metal', value: asset.metal }] : []),
    ...(asset.country ? [{ label: 'País', value: asset.country }] : []),
    // Common fields
    ...(asset.year ? [{ label: 'Año', value: asset.year }] : []),
    ...(asset.grade ? [{ label: 'Grado', value: asset.grade }] : []),
    ...(asset.authenticator
      ? [{ label: 'Autenticador', value: asset.authenticator }]
      : []),
    {
      label: 'Tipo de venta',
      value: asset.billing_type === 'auction' ? 'Subasta' : 'Precio fijo'
    },
    {
      label: 'Precio',
      value: asset.price
        ? `$${asset.price} ${asset.ticker || 'USD'}`
        : 'No disponible'
    },
    { label: 'Disponibles', value: asset.available_supply_units || '1' }
  ]

  return (
    <div className="flex flex-col space-y-3">
      {infoFields.map((field) => (
        <div
          className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
          key={field.label}
        >
          <span className="text-sm text-gray-500 sm:text-base">
            {field.label}
          </span>
          <span className="break-words text-sm font-bold text-gray-200 sm:text-right sm:text-base">
            {field.value}
          </span>
        </div>
      ))}
    </div>
  )
}
