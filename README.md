# DataNest — Product Explorer

DataNest is a responsive product explorer built with HTML, CSS, JavaScript, Vite, and Tailwind CSS. It uses the DummyJSON Products API to display and explore products.

## Features

- Fetches product data asynchronously using `async/await`
- Searches products by name
- Filters products by category
- Sorts products by price and name
- Displays product details on demand
- Shows loading and error states with a retry option
- Calculates product statistics using `reduce()`
- Saves favourite product IDs in `localStorage`
- Filters the catalogue to show favourite products
- Uses responsive layouts for different screen sizes

## Technologies

- HTML
- Tailwind CSS v4
- JavaScript ES modules
- Vite
- DummyJSON API
- Browser localStorage

## Run locally

1. Install Node.js.
2. Install project dependencies:

   `npm install`

3. Start the development server:

   `npm run dev`

4. Open the local URL shown in the terminal.

## API

Products: https://dummyjson.com/products

## State management

The application uses one shared state object for product data, categories, loading status, search text, selected category, sort order, and favourites. Search, filtering, and sorting operate on the products already loaded instead of fetching them again.

Favourite product IDs are saved in browser `localStorage`, so they remain available after a page refresh.

