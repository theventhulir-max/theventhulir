require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const FIVE_PRODUCTS = [
  {
    _id: '6aba0cd61452a86806531193',
    productCode: 'VEN-SP-CHL',
    slug: 'pure-red-chilli-powder',
    name: 'Pure Stone-Ground Chilli Powder',
    category: 'Spices & Powders',
    price: 40,
    originalPrice: 50,
    discountPercent: 20,
    badge: '100% Pure & Natural',
    imageUrl: '/assets/hero/chilli.png',
    images: ['/assets/hero/chilli.png'],
    rating: 4.9,
    reviewsCount: 184,
    description: '100% pure & natural red chilli powder with bright natural red color, medium spicy taste, and fine stone grind with no artificial preservatives.',
    variants: [
      { label: '100g', price: 40, originalPrice: 50, contents: '100g Pack' },
      { label: '200g', price: 75, originalPrice: 95, contents: '200g Pack' },
      { label: '500g', price: 190, originalPrice: 240, contents: '500g Pack' },
      { label: '1000g', price: 340, originalPrice: 420, contents: '1 Kg Family Pack' }
    ],
    inStock: true,
    currentStock: 100,
    initialStock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6aba0cd61452a86806531194',
    productCode: 'VEN-SP-COR',
    slug: 'single-origin-stone-ground-coriander-powder',
    name: 'Single-Origin Stone Ground Coriander Powder',
    category: 'Spices & Powders',
    price: 27,
    originalPrice: 35,
    discountPercent: 23,
    badge: '100% Pure & Natural',
    imageUrl: '/assets/hero/coriander.png',
    images: ['/assets/hero/coriander.png'],
    rating: 4.9,
    reviewsCount: 152,
    description: '100% pure & natural coriander powder with fresh aroma and smooth texture. Slow-ground from single-origin coriander seeds with zero preservatives.',
    variants: [
      { label: '100g', price: 27, originalPrice: 35, contents: '100g Pack' },
      { label: '200g', price: 56, originalPrice: 70, contents: '200g Pack' },
      { label: '500g', price: 135, originalPrice: 170, contents: '500g Pack' },
      { label: '1000g', price: 280, originalPrice: 350, contents: '1 Kg Family Pack' }
    ],
    inStock: true,
    currentStock: 100,
    initialStock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6aba0cd61452a86806531196',
    productCode: 'VEN-MS-GAR',
    slug: 'authentic-royal-garam-masala',
    name: 'Authentic Royal Garam Masala',
    category: 'Masala Blends',
    price: 100,
    originalPrice: 125,
    discountPercent: 20,
    badge: 'Warm Aromatic Blend',
    imageUrl: '/assets/hero/garam_masala.png',
    images: ['/assets/hero/garam_masala.png'],
    rating: 4.9,
    reviewsCount: 168,
    description: '100% pure & natural royal garam masala with authentic Indian taste and warm aromatic blend of hand-roasted heritage whole spices with no preservatives.',
    variants: [
      { label: '100g', price: 100, originalPrice: 125, contents: '100g Pack' },
      { label: '200g', price: 200, originalPrice: 250, contents: '200g Pack' },
      { label: '500g', price: 499, originalPrice: 620, contents: '500g Pack' },
      { label: '1000g', price: 956, originalPrice: 1190, contents: '1 Kg Family Pack' }
    ],
    inStock: true,
    currentStock: 100,
    initialStock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6aba0cd61452a86806531195',
    productCode: 'VEN-MS-SAM',
    slug: 'heritage-grandmothers-sambar-powder',
    name: 'Heritage Grandmothers Sambar Powder',
    category: 'Masala Blends',
    price: 32,
    originalPrice: 42,
    discountPercent: 24,
    badge: 'Home-Style Flavor',
    imageUrl: '/assets/hero/sambar.png',
    images: ['/assets/hero/sambar.png'],
    rating: 4.9,
    reviewsCount: 210,
    description: '100% pure & natural special South Indian spice mix crafted following traditional home recipes for an authentic and aromatic sambar.',
    variants: [
      { label: '100g', price: 32, originalPrice: 42, contents: '100g Pack' },
      { label: '200g', price: 60, originalPrice: 75, contents: '200g Pack' },
      { label: '500g', price: 150, originalPrice: 190, contents: '500g Pack' },
      { label: '1000g', price: 300, originalPrice: 380, contents: '1 Kg Family Pack' }
    ],
    inStock: true,
    currentStock: 100,
    initialStock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '6aba0cd61452a86806531192',
    productCode: 'VEN-SP-TUR',
    slug: 'high-curcumin-pure-turmeric-powder',
    name: 'High-Curcumin Pure Turmeric Powder',
    category: 'Spices & Powders',
    price: 40,
    originalPrice: 55,
    discountPercent: 27,
    badge: '100% Pure & Natural',
    imageUrl: '/assets/hero/turmeric.png',
    images: ['/assets/hero/turmeric.png'],
    rating: 4.9,
    reviewsCount: 196,
    description: '100% pure & natural high-curcumin authentic Salem turmeric powder, sun-dried and stone ground to retain natural color, aroma, and medicinal healing properties.',
    variants: [
      { label: '100g', price: 40, originalPrice: 55, contents: '100g Pack' },
      { label: '200g', price: 75, originalPrice: 95, contents: '200g Pack' },
      { label: '500g', price: 200, originalPrice: 260, contents: '500g Pack' },
      { label: '1000g', price: 400, originalPrice: 520, contents: '1 Kg Family Pack' }
    ],
    inStock: true,
    currentStock: 100,
    initialStock: 100,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const coll = mongoose.connection.collection('ProductDetails');
  
  // Wipe all existing products from collection
  const deleteResult = await coll.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} old products from ProductDetails collection.`);

  // Insert the 5 pristine products
  const insertResult = await coll.insertMany(FIVE_PRODUCTS);
  console.log(`Successfully inserted ${insertResult.insertedCount} products:`);
  
  FIVE_PRODUCTS.forEach(p => {
    console.log(`- ${p.name} (${p.category}) - 4 variants (100g: ₹${p.variants[0].price}, 200g: ₹${p.variants[1].price}, 500g: ₹${p.variants[2].price}, 1000g: ₹${p.variants[3].price})`);
  });

  process.exit(0);
}

run().catch(err => {
  console.error('Error syncing products:', err);
  process.exit(1);
});
