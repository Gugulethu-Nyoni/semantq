import Cartique from 'cartique';

// Example Usage:
const products = [
  {
    id: 1,
    title: 'Nike Air Max 270',
    description: "Men's running shoes with a full-length air unit.",
    price: 299.99,
    currency: '$',
    image: 'https://assets.superbalistcdn.co.za/500x720/filters:quality(75):format(jpg)/3974860/original.jpg', // Example image
    sale_price: 129.99,
  },
  {
    id: 2,
    title: 'Adidas Superstar',
    description: 'Classic shell-toed sneakers for men and women.',
    price: 79.99,
    currency: '$',
    image: 'https://www.side-step.co.za/media/catalog/product/cache/60023b40f56fdff39b9c495b8e044aef/a/d/add6022gt-adidas-retropy-f2-black-grey-white-ig9986-v1_jpg.jpg', // Example image
  },
  {
    id: 3,
    title: 'The North Face Thermoball Jacket',
    description: 'Water-resistant and breathable insulated jacket for men and women.',
    price: 179.99,
    currency: '$',
    image: 'https://www.younglifestore.com/cdn/shop/products/CL09041TheNorthFaceMen_sThermoBallTrekkerJacket6.jpg?v=1631912778&width=450', // Example image
    sale_price: 80.99,
  },
  {
    id: 4,
    title: "Levi's 501 Original Fit Jeans",
    description: 'Classic straight-fit jeans for men.',
    price: 69.99,
    currency: '$',
    image: 'https://assets.woolworthsstatic.co.za/501-Original-Fit-Jeans-INDIGO-506356158.jpg?V=hpEA&o=eyJidWNrZXQiOiJ3dy1vbmxpbmUtaW1hZ2UtcmVzaXplIiwia2V5IjoiaW1hZ2VzL2VsYXN0aWNlcmEvcHJvZHVjdHMvaGVyby8yMDIyLTA4LTAyLzUwNjM1NjE1OF9JTkRJR09faGVyby5qcGcifQ&w=800&q=85', // Example image
  },
  {
    id: 5,
    title: 'Vans Old Skool',
    description: 'Classic skateboarding shoes for men and women.',
    price: 59.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/178901246-1200-1600?v=638759944272900000&width=1200&height=1600&aspect=true', // Example image
  },
  {
    id: 6,
    title: 'Champion Life Hoodie',
    description: 'Soft and comfortable hoodie for men and women.',
    price: 29.99,
    currency: '$',
    image: 'https://cdn.shopify.com/s/files/1/0802/5836/7772/files/VN000D3HY28-HERO.jpg?v=1718880696', // Example image
  },
  {
    id: 7,
    title: 'Reebok Classic Leather',
    description: 'Iconic and versatile sneakers for men and women.',
    price: 69.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/179098005-1200-1600?v=638760030876370000&width=1200&height=1600&aspect=true', // Example image
  },
  {
    id: 8,
    title: 'Patagonia Tres 3-in-1 Parka',
    description: 'Versatile and sustainable parka for men and women.',
    price: 229.99,
    currency: '$',
    image: 'https://contents.mediadecathlon.com/p2077593/1cr1/k$82c176d3de769da9c2a8fe8c5329de0b/m-3-in-1-waterproof-comfort-10c-travel-trekking-jacket-travel-500-black.jpg?format=auto&f=1200x0', // Example image
  },
  {
    id: 9,
    title: 'Converse Chuck Taylor All Star',
    description: 'Classic and iconic sneakers for men and women.',
    price: 49.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/173440242-1200-1600?v=638725619779270000&width=1200&height=1600&aspect=true', // Example image
  },
  {
    id: 10,
    title: 'The North Face Venture 2 Jacket',
    description: 'Water-resistant and breathable jacket for men and women.',
    price: 99.99,
    currency: '$',
    image: 'https://thenorthface.co.za/cdn/shop/files/7QEYLFW2_960x_crop_center.png?v=1738400547', // Example image
  },
  {
    id: 11,
    title: 'Adidas Ultraboost',
    description: 'High-performance running shoes for men and women.',
    price: 179.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/173406258-1200-1600?v=638725600565000000&width=1200&height=1600&aspect=true', // Example image
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
  //sidebar: false,
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
    filters: productFilters
  }
});


