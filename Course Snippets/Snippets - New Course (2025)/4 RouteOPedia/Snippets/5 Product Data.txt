export const allProducts = [
  { id: 1, name: "Laptop Pro", price: 1299.99, category: "electronics" },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 199.99,
    category: "electronics",
  },
  { id: 3, name: "T-Shirt", price: 29.99, category: "clothing" },
  { id: 4, name: "Jeans", price: 79.99, category: "clothing" },
  { id: 5, name: "React Guide", price: 39.99, category: "books" },
  { id: 6, name: "JavaScript Guide", price: 49.99, category: "books" },
];

// Helper functions for working with products
export const getProductById = (id) => {
  return allProducts.find((product) => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  return allProducts.filter((product) => product.category === category);
};

export const getAllCategories = () => {
  return [...new Set(allProducts.map((product) => product.category))];
};