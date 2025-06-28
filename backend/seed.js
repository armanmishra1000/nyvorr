require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected for seeding...');
  seedDatabase();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function seedDatabase() {
  try {
    // Drop existing collections
    await mongoose.connection.dropDatabase();
    console.log('Dropped existing database');
    
    // Recreate indexes
    await Promise.all([
      Product.init(),
      User.init(),
      Order.init()
    ]);
    console.log('Recreated indexes');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true
    });

    await adminUser.save();
    console.log('Created admin user');

    // Create test user
    const testUser = new User({
      username: 'testuser',
      email: 'user@example.com',
      password: await bcrypt.hash('password123', salt)
    });
    
    await testUser.save();
    console.log('Created test user');

    // Create sample products
    const products = [
      {
        name: 'Premium Digital Product',
        description: 'High-quality digital product with all features',
        price: 99.99,
        image: '/images/product1.jpg',
        status: 'In Stock',
        variations: [
          { name: 'Basic', price: 49.99, stock: 100 },
          { name: 'Standard', price: 99.99, stock: 50 },
          { name: 'Premium', price: 149.99, stock: 25 }
        ],
        category: 'Digital'
      },
      {
        name: 'Basic Digital Package',
        description: 'Essential digital package for beginners',
        price: 29.99,
        image: '/images/product2.jpg',
        status: 'In Stock',
        variations: [
          { name: 'Monthly', price: 29.99, stock: 200 },
          { name: 'Yearly', price: 299.99, stock: 75 }
        ],
        category: 'Digital'
      },
      {
        name: 'Pro Digital Toolkit',
        description: 'Professional tools for digital creators',
        price: 199.99,
        image: '/images/product3.jpg',
        status: 'In Stock',
        variations: [
          { name: 'Single User', price: 199.99, stock: 50 },
          { name: 'Team (5 Users)', price: 899.99, stock: 20 },
          { name: 'Enterprise', price: 1499.99, stock: 10 }
        ],
        category: 'Digital'
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Create sample orders with unique order numbers
    const orders = [];
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const paymentMethods = ['Credit Card', 'PayPal', 'Crypto'];
    const usedOrderNumbers = new Set();
    
    function generateUniqueOrderNumber() {
      let orderNumber;
      do {
        orderNumber = `ORD-${1000 + Math.floor(Math.random() * 9000)}`;
      } while (usedOrderNumbers.has(orderNumber));
      usedOrderNumbers.add(orderNumber);
      return orderNumber;
    }
    
    // Create orders for the past 30 days
    for (let i = 0; i < 50; i++) {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
      
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const variation = product.variations[Math.floor(Math.random() * product.variations.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
      const subtotal = variation.price * quantity;
      const shipping = subtotal > 100 ? 0 : 9.99;
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + shipping + tax;
      
      orders.push({
        orderNumber: generateUniqueOrderNumber(),
        user: Math.random() > 0.5 ? adminUser._id : testUser._id,
        items: [{
          product: product._id,
          name: product.name,
          quantity,
          price: variation.price,
          variation: variation.name
        }],
        subtotal,
        shipping,
        tax,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        shippingAddress: '123 Test St, Test City, 12345',
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: Math.random() > 0.3 ? 'Paid' : 'Pending',
        paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: orderDate,
        updatedAt: orderDate
      });
    }

    await Order.insertMany(orders);
    console.log(`Created ${orders.length} orders`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}
