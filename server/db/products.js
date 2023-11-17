const client = require('./client');
const util = require('./util');

// database functions
async function getAllProducts(){
  try {
    const {rows} = await client.query(`
      SELECT * FROM products;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getProductById(id){
  try {
    const {rows: [product]} = await client.query(`
      SELECT * FROM products
      WHERE id = $1
    `, [id]);
    return product;
  } catch (error) {
    throw error;
  }
}
async function getProductByName(name){
  try {
    const {rows: [product]} = await client.query(`
      SELECT * FROM products
      WHERE name = $1
    `, [name]);
    return product;
  } catch (error) {
    throw error;
  }
}

async function createProduct({ name, description, price, imgUrl, category }){
  try {
    const {rows: [product]} = await client.query(`
      INSERT INTO products(name, description, price, imgUrl, category) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (name) DO NOTHING 
      RETURNING *
    `, [name, description, price, imgUrl, category]);
    return product;
  } catch (error) {
    throw error;
  }}

  async function updateProduct({ id, ...fields }) {
    try {
      // Filter out invalid column names
      const validColumns = ['name', 'description', 'price', 'imgUrl', 'category'];
      const validFields = Object.keys(fields).filter((key) => validColumns.includes(key));
      
      // Generate the SET clause
      const setClause = validFields.map((key, index) => `${key} = $${index + 1}`).join(', ');
  
      if (setClause.length > 0) {
        // Log the generated SQL query and parameters for debugging
        console.log('Update query:', `
          UPDATE products
          SET ${setClause}
          WHERE id = $${validFields.length + 1}
          RETURNING *;
        `);
        console.log('Query parameters:', validFields.map((key) => fields[key]), id);
  
        // Execute the query
        const query = `
          UPDATE products
          SET ${setClause}
          WHERE id = $${validFields.length + 1}
          RETURNING *;
        `;
        const values = validFields.map((key) => fields[key]).concat(id);
        const { rows } = await client.query(query, values);
  
        return rows[0];
      } else {
        // If no valid fields to update, return null or handle accordingly
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  
  
  

async function destroyProduct(id) {
  try {
    const {rows: [products]} = await client.query(`
        DELETE FROM products 
        WHERE id = $1
        RETURNING *;
    `, [id]);
    return products;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
  destroyProduct,
}