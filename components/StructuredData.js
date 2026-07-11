import { structuredData } from 'lib/structuredData'

const StructuredData = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(structuredData),
    }}
  />
)

export default StructuredData
