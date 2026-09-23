const PRODUCTION_OONI_API = 'https://api.ooni.org'

const normalizeUrl = (url) => url?.replace(/\/$/, '') ?? ''

export const shouldShowProductionApiWarning = () => {
  const apiUrl = normalizeUrl(process.env.NEXT_PUBLIC_OONI_API)
  if (apiUrl !== PRODUCTION_OONI_API) return false

  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return false
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return true

  if (process.env.NODE_ENV === 'development') return true
  return false
}

const ProductionApiNotice = () => {
  if (!shouldShowProductionApiWarning()) return null

  return (
    <div className="bg-red-600 text-white text-center text-sm py-2 px-4 z-[200]">
      Warning: This non-production environment is using the production OONI API (https://api.ooni.org).
    </div>
  )
}

export default ProductionApiNotice
