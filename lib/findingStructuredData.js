import { EXPLORER_BASE_URL, ORGANIZATION_ID } from 'lib/structuredData'

const getAuthorEntry = (name) => {
  const trimmedName = name?.trim()

  if (!trimmedName) {
    return null
  }

  if (trimmedName.toLowerCase() === 'ooni') {
    return { '@id': ORGANIZATION_ID }
  }

  return {
    '@type': 'Person',
    name: trimmedName,
  }
}

const parseReportedBy = (reportedBy) => {
  if (!reportedBy) {
    return []
  }

  return (
    reportedBy
      .match(/[^,(]+(?:\([^)]*\))?/g)
      ?.map((name) => name.trim())
      .filter(Boolean) ?? []
  )
}

const getAuthor = (reportedBy) => {
  const authors = parseReportedBy(reportedBy)
    .map(getAuthorEntry)
    .filter(Boolean)

  if (!authors.length) {
    return { '@id': ORGANIZATION_ID }
  }

  return authors
}

const getKeywords = (incident) => {
  const keywords = new Set()

  for (const tag of incident.tags ?? []) {
    keywords.add(tag.startsWith('theme-') ? tag.replace('theme-', '') : tag)
  }

  for (const theme of incident.themes ?? []) {
    keywords.add(theme.replace('_', ' '))
  }

  return [...keywords]
}

export const getFindingStructuredData = (incident, canonicalUrl) => {
  const keywords = getKeywords(incident)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: incident.title,
    description: incident.short_description,
    url: canonicalUrl,
    datePublished: incident.create_time,
    author: getAuthor(incident.reported_by),
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    isPartOf: {
      '@id': `${EXPLORER_BASE_URL}/#website`,
    },
    inLanguage: 'en',
  }

  if (incident.text) {
    schema.articleBody = incident.text
  }

  if (incident.update_time) {
    schema.dateModified = incident.update_time
  }

  if (keywords.length) {
    schema.keywords = keywords.join(', ')
  }

  return schema
}
