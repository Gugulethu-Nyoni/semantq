import Cartique from 'cartique';

const products = [
  {
    id: 1,
    title: 'Arthritis Support',
    description: 'Helps support healthy muscles and organs.',
    price: 70.00,
    currency: 'R',
    image: '/images/products/arthritis.jpg'
  },
  {
    id: 2,
    title: 'Body Booster',
    description: 'Supports a healthy body & skin. Aids in weight loss. Helps prevent heart disease.',
    price: 70.00,
    currency: 'R',
    image: '/images/products/body_booster.jpg'
  },
  {
    id: 3,
    title: 'Asthma Support',
    description: 'Assists with asthma relief.',
    price: 70.00,
    currency: 'R',
    image: '/images/products/asthma.jpg'
  },
  {
    id: 4,
    title: 'Blood Cleanser',
    description: 'Helps cleanse blood. Supports stress relief. Assists with HIV management.',
    price: 70.00,
    currency: 'R',
    image: '/images/products/asthma.jpg'
  },
  {
    id: 5,
    title: 'Infertility Remedy',
    description: 'Boosts fertility prospects',
    price: 70.00,
    currency: 'R',
    image: '/images/products/infertility.jpg'
  },
  {
    id: 6,
    title: 'Drop',
    description: 'Boosts the body',
    price: 70.00,
    currency: 'R',
    image: '/images/products/drop.jpg'
  }
];



const features = {
  grid: true, // Use grid layout
  pagination: false, // Disable pagination
  columns: 3, // 3 columns in grid layout
  rows: 6, // Show 6 products per page
  theme: '#fff', // Set theme to blue
  sale: true, // Enable sale badges
  search: true, // Enable search
  sorting: true, // Enable sorting
  checkoutUrl: 'https://www.google.com/',
  checkoutUrlMode: '_blank', // options are self or blank
  sidebar: false,
  //containerId: 'customId', // Use custom container ID
};

const productFilters = {
  color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White'],
  size: ['S', 'M', 'L', 'XL', 'XXL', 'XS'],
  brand: ['Adidas', 'Nike', 'Puma', 'Reebok', 'Converse', 'Vans', 'New Balance'],
  category: ['Shoes', 'T-Shirts', 'Hoodies', 'Pants', 'Shorts', 'Dresses', 'Jackets'],
  priceRange: ['Under $20', '$20-$50', '$50-$100', '$100-$200', 'Over $200'],
  rating: ['1-2 stars', '2-3 stars', '3-4 stars', '4-5 stars'],
  material: ['Cotton', 'Polyester', 'Leather', 'Synthetic', 'Wool'],
  style: ['Casual', 'Formal', 'Sporty', 'Vintage', 'Streetwear']
};



const shopUI = new Cartique(products, {
  ...features,
  sidebarFeatures: {
    priceFilter: true,
    colorFilter: true,
    sizeFilter: true,
    brandFilter: true,
    filters: productFilters,
  },
});
