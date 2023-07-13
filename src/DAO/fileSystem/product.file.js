const fs = require("fs");
const path = require("path");
const filepath = path.join(__dirname, "../fileSystem/products.json");

class ProductDaoFile {
  constructor() {
    this.products = [];
    this.path = filepath;
    this.lastId = 1
    try {
      if (fs.existsSync(this.path)) {
      const jsonFile = fs.readFileSync(this.path, "utf-8");
      const data = JSON.parse(jsonFile)
      this.products = data
      } else {
      fs.writeFileSync(this.path, JSON.stringify(this.products), "utf-8")
      }
    } catch (err) {
      console.log(err) 
    } 
  };

  async getProducts() {
    try {
      return this.products;
    } catch (err) {
      console.log(err);
    }
  };

  async createProduct(newProduct){
    try {
      const {
        title,
        description,
        price,
        code,
        stock,
        category,
      } = newProduct

      const existingCode = this.products.find((product) => product.code === code);

      if (!title || !description || !code || !price || !stock || !category ) {
        return console.log("Todos los campos son obligatorios!")
      } else if (existingCode) {
        return console.log("codigo ya existente")
      } else {
        if (this.products.length > 0) {
          this.lastId = this.products[this.products.length - 1].id + 1;
        }
        this.products.push({ id: this.lastId, ...newProduct });
        await fs.promises.writeFile(this.path,JSON.stringify(this.products, "utf-8", "\t"));
        return this.products
      }

    } catch (err) {
      console.log(err);
    }
  };

  async getProductById(id){
    try{
      return await this.products.find((product) => product.id === parseInt(id));
    } catch (err){
      console.log(err)
    }
  };

  async deleteProduct(id){
    try{
      const productIndex = this.products.findIndex((product) => product.id === parseInt(id));
      const productsFilter = this.products.filter((product) => product.id !== parseInt(id));
      if (productIndex === -1) {
        return
      } 
      await fs.promises.writeFile(this.path,JSON.stringify(productsFilter, "utf-8", "\t"));
      return productsFilter
    } catch (err){
      console.log(err)
    }
  };

  async updateProduct(id, obj){
    try {
      const productIndex = this.products.findIndex((product) => product.id === parseInt(id));
      if (productIndex === -1) {
        return console.log(`El producto con ID ${id} no existe.`);
      } 

      let oldProducts = await this.getProducts();
      let newProducts = oldProducts.map((product) => {
        if (product.id === parseInt(id)) {
          return { ...product, ...obj };
        } else {
          return product;
        }
      });

      await fs.promises.writeFile(this.path, JSON.stringify(newProducts, "utf-8", "\t"));
      return newProducts;
    } catch (err) {
      console.log(err);
    }
  };
};

module.exports= ProductDaoFile;