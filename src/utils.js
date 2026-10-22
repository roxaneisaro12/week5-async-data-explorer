
export function getVisibleItems({ items, query, filter, sort }) {
  const searchText = query.trim().toLowerCase()

  const filteredItems = items
    .filter(({ title }) =>
      title.toLowerCase().includes(searchText)
    )
    .filter(({ category }) =>
      filter === 'all' || category === filter
    )

  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    name: (a, b) => a.title.localeCompare(b.title)
  }

  return sorters[sort]
    ? filteredItems.toSorted(sorters[sort])
    : filteredItems
}
