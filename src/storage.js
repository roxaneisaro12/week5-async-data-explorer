
const STORAGE_KEY = 'datanest-favourites'

// Load saved favourite product IDs
export function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save favourite product IDs
export function saveFavourites(favourites) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favourites)
  )
}
