import bcrypt from 'bcryptjs'

import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

const categories = [
  { name: 'Seeds', slug: 'seeds', emoji: '🌱' },
  { name: 'Fertilisers', slug: 'fertilisers', emoji: '🧪' },
  { name: 'Pesticides', slug: 'pesticides', emoji: '🛡️' },
  { name: 'Veterinary', slug: 'veterinary', emoji: '🐄' },
  { name: 'Tools', slug: 'tools', emoji: '🔧' },
  { name: 'Animal Feeds', slug: 'animal-feeds', emoji: '🌾' },
]

const products = [
  { name: 'Certified Hybrid Maize Seeds', slug: 'hybrid-maize-seeds', description: 'High-yield drought-tolerant variety. 5kg pack covers 1 acre. KEPHIS certified.', price: 1200, stock: 150, emoji: '🌽', badge: 'hot', featured: true, categorySlug: 'seeds' },
  { name: 'Sunflower Seeds 2kg', slug: 'sunflower-seeds-2kg', description: 'Commercial sunflower variety, oil content >42%. Suitable for all zones.', price: 450, stock: 200, emoji: '🌻', badge: '', featured: false, categorySlug: 'seeds' },
  { name: 'Sukari F1 Tomato Seeds', slug: 'sukari-f1-tomato', description: 'Disease-resistant, high yield. 10g pack. Suitable for greenhouse & open field.', price: 850, stock: 80, emoji: '🍅', badge: 'new', featured: true, categorySlug: 'seeds' },
  { name: 'Watermelon Sugar Baby Seeds', slug: 'watermelon-sugar-baby', description: 'Early maturing, sweet variety. 50g pack, ideal for small farms.', price: 380, stock: 120, emoji: '🍉', badge: '', featured: false, categorySlug: 'seeds' },
  { name: 'DAP Fertiliser 50kg', slug: 'dap-fertiliser-50kg', description: 'Diammonium phosphate for base application. Boosts root development.', price: 3800, stock: 60, emoji: '🧪', badge: '', featured: true, categorySlug: 'fertilisers' },
  { name: 'CAN Fertiliser 50kg', slug: 'can-fertiliser-50kg', description: 'Calcium ammonium nitrate for top dressing. 26% Nitrogen content.', price: 3200, stock: 75, emoji: '⚗️', badge: '', featured: false, categorySlug: 'fertilisers' },
  { name: 'Urea Fertiliser 50kg', slug: 'urea-fertiliser-50kg', description: '46% Nitrogen content for leafy growth. Ideal for maize and wheat.', price: 3500, stock: 50, emoji: '🌿', badge: '', featured: false, categorySlug: 'fertilisers' },
  { name: 'NPK 17:17:17 25kg', slug: 'npk-17-17-17', description: 'Balanced fertiliser for all crops. Ideal for horticulture.', price: 2200, stock: 90, emoji: '🔬', badge: 'new', featured: false, categorySlug: 'fertilisers' },
  { name: 'Dimethoate EC 400ml', slug: 'dimethoate-ec-400ml', description: 'Broad-spectrum insecticide for aphids, thrips and mites.', price: 580, stock: 200, emoji: '🧴', badge: '', featured: false, categorySlug: 'pesticides' },
  { name: 'Mancozeb 80% WP 1kg', slug: 'mancozeb-80-wp-1kg', description: 'Contact fungicide for blight, mildew and leaf spot diseases.', price: 620, stock: 150, emoji: '🛡️', badge: '', featured: false, categorySlug: 'pesticides' },
  { name: 'Karate 2.5% EC 1L', slug: 'karate-ec-1l', description: 'Pyrethroid insecticide for cutworms and army worms.', price: 980, stock: 100, emoji: '🌊', badge: 'sale', featured: false, categorySlug: 'pesticides' },
  { name: 'Amoxicillin Vet 100ml', slug: 'amoxicillin-vet-100ml', description: 'Broad-spectrum antibiotic for cattle, goats and poultry.', price: 950, stock: 60, emoji: '💉', badge: '', featured: false, categorySlug: 'veterinary' },
  { name: 'Vitamin ADE Injection 100ml', slug: 'vitamin-ade-100ml', description: 'Essential vitamins for cattle and goats. Boosts immunity.', price: 750, stock: 80, emoji: '💊', badge: 'new', featured: false, categorySlug: 'veterinary' },
  { name: 'Ivermectin Pour-On 1L', slug: 'ivermectin-pour-on-1l', description: 'Broad-spectrum antiparasitic for cattle. Controls internal and external parasites.', price: 2800, stock: 40, emoji: '🐮', badge: '', featured: true, categorySlug: 'veterinary' },
  { name: 'Hand Sprayer 16L Knapsack', slug: 'hand-sprayer-16l', description: 'Heavy-duty knapsack sprayer with stainless steel wand. 3-year warranty.', price: 2800, stock: 30, emoji: '🪣', badge: '', featured: true, categorySlug: 'tools' },
  { name: 'Soil pH Meter', slug: 'soil-ph-meter', description: 'Digital soil pH and moisture meter. Essential for precision farming.', price: 1500, stock: 25, emoji: '📊', badge: 'new', featured: false, categorySlug: 'tools' },
  { name: 'Dairy Meal Premium 70kg', slug: 'dairy-meal-premium-70kg', description: 'High-protein formulation for maximum milk production. 18% crude protein.', price: 2200, stock: 80, emoji: '🐄', badge: '', featured: true, categorySlug: 'animal-feeds' },
  { name: 'Layers Mash 50kg', slug: 'layers-mash-50kg', description: 'Complete feed for laying hens. 16% protein, enriched with calcium.', price: 1800, stock: 100, emoji: '🐔', badge: '', featured: false, categorySlug: 'animal-feeds' },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@greenroots.co.ke' },
    update: {},
    create: {
      name: 'GreenRoots Admin',
      email: 'admin@greenroots.co.ke',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '254700000000',
    },
  })
  console.log('✅ Admin user created')

  // Categories
  const catMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    catMap[cat.slug] = created.id
  }
  console.log('✅ Categories seeded')

  // Products
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        emoji: p.emoji,
        badge: p.badge || null,
        featured: p.featured,
        categoryId: catMap[p.categorySlug],
      },
    })
  }
  console.log('✅ Products seeded')
  console.log('🎉 Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
