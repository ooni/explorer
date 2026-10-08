import { structuredData } from 'lib/structuredData'

const StructuredData = ({ data = structuredData }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
)

export default StructuredData
