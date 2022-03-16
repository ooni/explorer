import axios from 'axios'

export const exportToCsv = async (query) => {
  const qs = new URLSearchParams(query).toString()
  const reqUrl = `${process.env.NEXT_PUBLIC_AGGREGATION_API || process.env.NEXT_PUBLIC_MEASUREMENTS_URL}/api/v1/aggregation?${qs}&format=CSV`;
  try {
    const response = await axios.get(reqUrl);
    const element = document.createElement('a');
    element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(response.data);
    element.download = 'data.csv';
    element.click();
  } catch (error) {
    console.log(error)
  }
};

export const exportToJson = (jsonContent) => {
  const element = document.createElement('a');
  element.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonContent, null, '\t'));
  element.download = 'data.json';
  element.click();
}
