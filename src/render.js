
import { getVisibleItems } from './utils.js'

const app = document.querySelector('#app')

// Safely display text received from the API
function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character])
}

export function render(state) {
  if (state.status === 'loading') {
    app.innerHTML = `
      <main class="min-h-screen bg-slate-50 p-8">
        <p class="text-center text-lg" role="status">
          Loading products...
        </p>
      </main>
    `
    return
  }

  if (state.status === 'error') {
    app.innerHTML = `
      <main class="min-h-screen bg-slate-50 p-8 text-center">
        <h1 class="text-2xl font-bold text-red-700">
          We couldn't load the products
        </h1>
        <p class="my-4">${escapeHTML(state.error)}</p>
        <button id="retry-button"
          class="rounded-lg bg-slate-900 px-5 py-3 text-white">
          Try again
        </button>
      </main>
    `
    return
  }

  const allVisibleItems = getVisibleItems(state)

  const products = state.showFavourites
    ? allVisibleItems.filter(({ id }) =>
        state.favourites.includes(id)
      )
    : allVisibleItems

  const averagePrice = products.length
    ? products.reduce((total, { price }) => total + price, 0) /
      products.length
    : 0

  app.innerHTML = `
    <main class="min-h-screen bg-slate-50 px-5 py-8 text-slate-900">
      <header class="mx-auto mb-8 max-w-7xl">
        <p class="text-sm font-semibold uppercase tracking-widest text-emerald-700">
          DATANEST · PRODUCT EXPLORER
        </p>
        <h1 class="mt-2 text-4xl font-bold">Find your next favourite</h1>
        <p class="mt-2 text-slate-600">
          Explore products, compare prices and discover something new.
        </p>
      </header>

      <section class="mx-auto max-w-7xl">
        <div class="mb-6 grid gap-3 md:grid-cols-3">
          <label class="md:col-span-2">
            <span class="mb-1 block text-sm font-medium">
              Search products
            </span>
            <input id="search-input" type="search"
              placeholder="Search by product name..."
              value="${escapeHTML(state.query)}"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3">
          </label>

          <label>
            <span class="mb-1 block text-sm font-medium">Category</span>
            <select id="category-filter"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3">
              <option value="all">All categories</option>
              ${state.categories.map(category => `
                <option value="${escapeHTML(category)}"
                  ${state.filter === category ? 'selected' : ''}>
                  ${escapeHTML(category)}
                </option>
              `).join('')}
            </select>
          </label>
        </div>

        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p id="results-status" aria-live="polite"
            class="text-sm text-slate-600">
            Showing ${products.length} products
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <button id="favourites-filter"
              type="button"
              aria-pressed="${Boolean(state.showFavourites)}"
              class="rounded-lg border border-rose-200 px-4 py-2 font-medium text-rose-700 hover:bg-rose-50">
              ${state.showFavourites ? '♥ Show all products' : '♡ My favourites'}
              (${state.favourites.length})
            </button>

            <label class="flex items-center gap-2 text-sm">
              Sort by
              <select id="sort-select"
                class="rounded-lg border border-slate-300 bg-white px-3 py-2">
                <option value="default"
                  ${state.sort === 'default' ? 'selected' : ''}>
                  Default
                </option>
                <option value="price-asc"
                  ${state.sort === 'price-asc' ? 'selected' : ''}>
                  Price: low to high
                </option>
                <option value="price-desc"
                  ${state.sort === 'price-desc' ? 'selected' : ''}>
                  Price: high to low
                </option>
                <option value="name"
                  ${state.sort === 'name' ? 'selected' : ''}>
                  Name: A–Z
                </option>
              </select>
            </label>
          </div>
        </div>

        <section aria-label="Product results"
          class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          ${products.length ? products.map(({ id, title, price, category, thumbnail, rating }) => `
            <article
              class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

              <button type="button" data-product-id="${id}"
                class="block w-full text-left focus:outline-2 focus:outline-emerald-600">
                <img src="${escapeHTML(thumbnail)}"
                  alt="${escapeHTML(title)}"
                  loading="lazy"
                  class="mb-4 h-44 w-full rounded-lg bg-slate-100 object-contain">

                <p class="text-xs uppercase tracking-wide text-emerald-700">
                  ${escapeHTML(category)}
                </p>

                <h2 class="mt-2 font-semibold">
                  ${escapeHTML(title)}
                </h2>

                <div class="mt-3 flex items-center justify-between gap-2">
                  <span class="text-lg font-bold">
                    $${Number(price).toFixed(2)}
                  </span>
                  <span class="text-sm text-slate-500">
                    ★ ${escapeHTML(rating)}
                  </span>
                </div>

                <span class="mt-3 block text-sm font-medium text-emerald-700">
                  View product details →
                </span>
              </button>

              <button type="button"
                data-favourite-id="${id}"
                aria-pressed="${state.favourites.includes(id)}"
                aria-label="${state.favourites.includes(id) ? 'Remove ' + escapeHTML(title) + ' from favourites' : 'Add ' + escapeHTML(title) + ' to favourites'}"
                class="mt-3 w-full rounded-lg border border-rose-200 px-3 py-2 font-medium text-rose-700 hover:bg-rose-50">
                ${state.favourites.includes(id) ? '♥ Remove favourite' : '♡ Add to favourites'}
              </button>
            </article>
          `).join('') : `
            <p class="col-span-full rounded-xl bg-white p-8 text-center text-slate-600">
              ${state.showFavourites && state.favourites.length === 0
                ? 'You have no favourites yet. Add some using the heart buttons.'
                : state.showFavourites
                  ? 'No favourite products match your current search or category.'
                  : 'No products match your search. Try another name or category.'}
            </p>
          `}
        </section>

        <section aria-label="Product statistics"
          class="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-2">
          <p class="text-slate-600">
            Products shown:
            <strong class="text-slate-900">${products.length}</strong>
          </p>
          <p class="text-slate-600">
            Average price:
            <strong class="text-slate-900">$${averagePrice.toFixed(2)}</strong>
          </p>
        </section>
      </section>

      <dialog id="product-dialog"
        class="mx-auto my-auto w-11/12 max-w-xl rounded-2xl p-6 shadow-xl backdrop:bg-slate-900/50">
        <div id="product-details"></div>
        <button id="close-dialog"
          class="mt-5 rounded-lg bg-slate-900 px-5 py-3 text-white">
          Close details
        </button>
      </dialog>
    </main>
  `
}
