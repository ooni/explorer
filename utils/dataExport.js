import axios from 'axios'

export const requestUrl = (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${process.env.NEXT_PUBLIC_AGGREGATION_API || process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/v1/aggregation?${qs}&format=CSV`

  return reqUrl;
}

const getFormattedDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

export const exportToCsv = async (event, query) => {
  event.preventDefault();
  const url = requestUrl(query);

  try {
    const response = await axios.get(url)
    const element = document.createElement('a')
    element.href = 'data:text/csv;charset=utf-8,' + response.data
    element.download = `${getFormattedDate()}-ooni-data.csv`
    element.click()
  } catch (error) {
    console.log(error)
  }
}

export const exportToJson = (event, jsonContent) => {
  event.preventDefault();
  const element = document.createElement('a')
  element.href = 'data:text/json;charset=utf-8,' + JSON.stringify(jsonContent, null, '\t')
  element.download = `${getFormattedDate()}-ooni-data.json`
  element.click()
}
