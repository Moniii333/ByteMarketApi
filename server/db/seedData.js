const { createUser, createProduct, addUserShippingInfo } = require('.');
const client = require('./client');

async function dropTables() {
  console.log('Dropping All Tables...');
  // drop all tables, in the correct order
  try {
    await  client.query(`
    DROP TABLE IF EXISTS shipping_information;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
  `)
  } catch (error) {
    throw error; 
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");
    // create all tables, in the correct order

    await  client.query(`
      CREATE TABLE users(
        id  SERIAL PRIMARY KEY, 
        username VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL,
        email VARCHAR(320) UNIQUE NOT NULL
      );
    `)

    await client.query(`
      CREATE TABLE shipping_information (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        address VARCHAR
      );
    `)

    await  client.query(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      imgUrl VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(50) NOT NULL
      );
    `)
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

/* 

Initial Data 

*/

async function createInitialUsers() {
  console.log('Starting to create users...');
  try {

    const usersToCreate = [
      { username: 'Moniii333', password: 'Monique3', email: 'moniii@ByteMarket.com' },
      { username: 'phoreal14', password: 'Garren7', email: 'phoreal@ByteMarket.com' },
      { username: 'jnett93', password: 'Jonathan9', email: 'jnett@ByteMarket.com' },
      { username: 'rachel', password: 'rachel-watkins', email: 'rachel-watkins@ByteMarket.com' },
      { username: 'Admin', password: 'Admin123', email: 'admin.support@ByteMarket.com' },
    ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}
async function createShippingInfo() {
  try{
    const shipmentInfo = [
      { user_id: 4, first_name: 'John', last_name: 'Doe', address: '42 Wallaby Way, Sydney'},
    ]
    const info = await Promise.all(shipmentInfo.map(info => addUserShippingInfo(info.user_id, info)));
    console.log('Shipment info created:', info)
    console.log('Finished creating shipment info.')
  } catch(error) {
    console.error('Error creating shipment info', error)
  }
}
async function createProducts() {
  try {
    console.log('Starting to create products...');

    const productsToCreate = [
      { name: 'Samsung Tab S7', description: 'New Samsung S7 tablet, 64GB, WIFI capablities with S pen included!', price: '125', imgUrl: 'https://images.unsplash.com/photo-1622533950960-2ed47209dab0?auto=format&fit=crop&q=80&w=1809&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'tablet' },
      { name: 'Samsung Galaxy S20(Random color)', description: 'Refurbished Samsung S20 phones! All cables included. Colors are chosen at random, due to how fast these fly off the shelf! Returns for the wrong color will not be accepted.', price: '150', imgUrl: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&q=80&w=1635&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'phone' },
      { name: 'Curved Monitor', description: 'Brand new 32" 165hz curved monitor, in original box.', price: '70', imgUrl: 'https://images.unsplash.com/photo-1666771410003-8437c4781d49?auto=format&fit=crop&q=80&w=1674&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'monitor' },
      { name: 'Alienware Gaming Setup', description: 'Alienware Aurora R15, Alienware 32" monitor, RGB keyboard, wireless gaming mouse and wired gaming headset. Perfect for those high powered games or video editing!', price: '3,399', imgUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1742&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'setup' },
      { name: 'Apple Airpods Pro', description: 'Refurbished Airpod Pros, comes with charging cable and apple stickers.', price: '80', imgUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&q=80&w=1674&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'headphones' },
      { name: 'iPhone 15', description: '15th Generation iPhone. Hot off the truck!', price: '800', imgUrl: 'https://i.imgur.com/NWAb2eN.jpeg', category: 'phone' },
      { name: 'iPad Pro 2018', description: 'This refurbished 64GB iPad has undergone rigorous testing and meets our high quality standards, ensuring it performs like new.', price: '220', imgUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=1715&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'tablet' },
      { name: 'ASUS Gaming Monitor', description: '27” Full HD (1920x1080) Panel 144Hz refresh rate and 1ms (GTG) response time gaming monitor and free Sync/Adaptive Sync for a tear-free experience', price: '150', imgUrl: 'https://i.imgur.com/zmj9BOv.jpeg', category: 'monitor' },
      { name: 'ASUS Gaming Setup', description: 'Omen 30L RTX 3060 Ryzen 5, iPad 11" M1, Roccat gaming keyboard, one 60hz vertical and one 165hz omen horizontal monitors. Perfect out of the box ready to handle all your gaming needs!', price: '3,600', imgUrl: 'https://i.imgur.com/pRcIuSZ.jpeg', category: 'setup' },
      { name: 'Stand-up Charging Station', description: 'Charging station charges your iPhone upright. With one full charge taking less than 60 minutes.', price: '9.99', imgUrl: 'https://images.unsplash.com/photo-1617975426095-f073792aef15?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'charger' },
      { name: 'Dual MagSafe Charger', description: 'Allows for charging of two MagSafe approved devices. Full charge for both devices at once in under 120 minutes.', price: '19.99', imgUrl: 'https://images.unsplash.com/photo-1587749091230-fb8a034d695c?auto=format&fit=crop&q=80&w=1480&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', category: 'charger' }
    ]
    const products = await Promise.all(productsToCreate.map(createProduct));

    console.log('products created:');
    console.log(products);

    console.log('Finished creating products!');
  } catch (error) {
    console.error('Error creating products!', error);
    throw error;
  }
}


async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createShippingInfo();
    await createProducts();
  } catch (error) {
    console.log('Error during rebuildDB')
    throw error;
  }
}

module.exports = {
  rebuildDB
};