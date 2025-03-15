import Cartique from 'cartique';

const elem = document.getElementById('cartique');

if (elem) alert("Store Js does pick up page DOM");

// Wait for the contentLoaded event
document.addEventListener('contentLoaded', (event) => {
  const targetRoute = event.detail.route;

  // Only initialize Cartique for the store route
  if (targetRoute === 'store') {
    const products = [
      {
        id: 1,
        title: 'Arthritis Support',
        description: 'Helps support healthy muscles and organs.',
        price: 70.0,
        currency: 'R',
        image: '/images/products/arthritis.jpg',
      },
      // Add more products
    ];

    const features = {
      grid: true,
      pagination: false,
      columns: 3,
      rows: 6,
      theme: '#fff',
      sale: true,
      search: true,
      sorting: true,
      checkoutUrl: 'https://www.google.com/',
      checkoutUrlMode: '_blank',
      sidebar: false,
    };

    const productFilters = {
      color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White'],
      size: ['S', 'M', 'L', 'XL', 'XXL', 'XS'],
      brand: ['Adidas', 'Nike', 'Puma', 'Reebok', 'Converse', 'Vans', 'New Balance'],
      category: ['Shoes', 'T-Shirts', 'Hoodies', 'Pants', 'Shorts', 'Dresses', 'Jackets'],
      priceRange: ['Under $20', '$20-$50', '$50-$100', '$100-$200', 'Over $200'],
      rating: ['1-2 stars', '2-3 stars', '3-4 stars', '4-5 stars'],
      material: ['Cotton', 'Polyester', 'Leather', 'Synthetic', 'Wool'],
      style: ['Casual', 'Formal', 'Sporty', 'Vintage', 'Streetwear'],
    };

    // Initialize Cartique
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
  }
});