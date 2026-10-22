
import './style.css'
import { getProducts, getCategories, getProduct } from './api.js'
import { render } from './render.js'
import { loadFavourites, saveFavourites } from './storage.js'

const state = {
  items: [],
  categories: [],
  status: 'loading',
  error: null,
  query: '',
  filter: 'all',
  sort: 'default',
  favourites: loadFavourites(),
  showFavourites: false
}

async function load() {
  state.status = 'loading'
  state.error = null
  render(state)

  try {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ])

    state.items = productsData.products

    // Only show categories that have loaded products
    state.categories = [
      ...new Set(state.items.map(({ category }) => category))
    ].toSorted()

    state.status = 'success'
  } catch (error) {
    state.status = 'error'
    state.error = error.message
  }

  render(state)
}

const app = document.querySelector('#app')

// Search products without making another API request
app.addEventListener('input', (event) => {
  if (event.target.id === 'search-input') {
    const cursorPosition = event.target.selectionStart
    state.query = event.target.value

    render(state)

    const searchInput = document.querySelector('#search-input')
    searchInput.focus()
    searchInput.setSelectionRange(cursorPosition, cursorPosition)
  }
})

// Category and sorting filters
app.addEventListener('change', (event) => {
  if (event.target.id === 'category-filter') {
    state.filter = event.target.value
    render(state)
  }

  if (event.target.id === 'sort-select') {
    state.sort = event.target.value
    render(state)
  }
})

// Product details, favourites, and retry button
app.addEventListener('click', async (event) => {
  const favouriteButton = event.target.closest('[data-favourite-id]')

  if (favouriteButton) {
    const productId = Number(favouriteButton.dataset.favouriteId)

    if (state.favourites.includes(productId)) {
      state.favourites = state.favourites.filter(
        (id) => id !== productId
      )
    } else {
      state.favourites = [...state.favourites, productId]
    }

    saveFavourites(state.favourites)
    render(state)
    return
  }

  if (event.target.closest('#favourites-filter')) {
    state.showFavourites = !state.showFavourites
    render(state)
    return
  }

  if (event.target.closest('#retry-button')) {
    await load()
    return
  }

  const productCard = event.target.closest('[data-product-id]')

  if (productCard) {
    const productId = productCard.dataset.productId
    const dialog = document.querySelector('#product-dialog')
    const details = document.querySelector('#product-details')

    details.textContent = 'Loading product details...'
    dialog.showModal()

    try {
      const product = await getProduct(productId)

      details.textContent = [
        product.title,
        '',
        product.description,
        '',
        `Price: $${product.price.toFixed(2)}`,
        `Category: ${product.category}`,
        `Rating: ${product.rating}`,
        `Stock: ${product.stock}`
      ].join('\n')
    } catch (error) {
      details.textContent =
        `Could not load product details: ${error.message}`
    }

    return
  }

  if (event.target.closest('#close-dialog')) {
    document.querySelector('#product-dialog').close()
  }
})

load()
