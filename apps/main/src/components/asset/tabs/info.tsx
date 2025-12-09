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
    { label: 'Disponibles', value: asset.available_supply_units || 'N/A' }
  ]

  return (
    <div className="flex flex-col space-y-3">
      {infoFields.map((field) => (
        <div
          className="flex w-full items-center justify-between"
          key={field.label}
        >
          <span className="text-gray-500">{field.label}</span>
          <span className="font-bold text-gray-200">{field.value}</span>
        </div>
      ))}
    </div>
  )
}
