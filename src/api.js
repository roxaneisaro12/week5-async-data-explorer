
const BASE_URL = 'https://dummyjson.com'

// Reusable function for fetching JSON data
export async function getJSON(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

// Fetch the products
export const getProducts = () =>
  getJSON(`${BASE_URL}/products?limit=0`)

// Fetch one product by its ID
export const getProduct = (id) =>
  getJSON(`${BASE_URL}/products/${id}`)

// Fetch the available categories
export const getCategories = () =>
  getJSON(`${BASE_URL}/products/category-list`)
