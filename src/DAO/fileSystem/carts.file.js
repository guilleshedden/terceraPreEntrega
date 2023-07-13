const fs = require("fs")
const path = require("path")
const filepath = path.join(__dirname, "../fileSystem/carts.json")

class CartDaoFile {
  constructor() {
    this.carts = []
    this.path = filepath
    this.lastId = 1
    try {
      if (fs.existsSync(this.path)) {
      const jsonFile = fs.readFileSync(this.path, "utf-8");
      const data = JSON.parse(jsonFile)
      this.carts = data
      } else {
      fs.writeFileSync(this.path, JSON.stringify(this.carts), "utf-8")
      }    
    } catch (err) {
      console.log(err) 
    } 
  }

  async createCart(obj){
    try {
      if (this.carts.length > 0) {
        this.lastId = this.carts[this.carts.length - 1].id + 1;
      }
      const newCart = { id: this.lastId, ...obj }
      this.carts.push(newCart);
      await fs.promises.writeFile(this.path,JSON.stringify(this.carts, "utf-8", "\t"));
      return newCart
    } catch (err) {
      console.log(err);
    }
  }

  async getCarts(){
    try {
      return this.carts;
    } catch (err) {
      console.log(err);
    }
  }

  async getCartById(cid){
    try{
      return this.carts.find(product => product.id === parseInt(cid))
    }catch(err){
      console.log(err)
    }
  }

  async addToCart(cid, pid, cantidad){
    try {
      const carts = await this.getCarts()
      const cart = carts.find(element => element.id === parseInt(cid))
      
        const addProduct = cart.products.find(element => element.idProduct === parseInt(pid))
        if(addProduct) {
          addProduct.cantidad += cantidad
        }else{
          cart.products.push({idProduct: parseInt(pid), cantidad: cantidad })
        }
        await fs.promises.writeFile(this.path, JSON.stringify(carts, "utf-8", "\t"));
        return cart
    } catch (error) {
      console.log(error);
    }
  }

  async emptyCart(cid){
    try {
      let cart = await this.getCartById(cid)
      return cart.products = []
    } catch (err) {
      console.log(err)
    }
  }

  async deleteProductFromCart(cid, pid){
    try{
      const carts = await this.getCarts()
      const cart = carts.find(element => element.id === parseInt(cid))
      const deleteProduct = cart.products.find(element => element.idProduct === parseInt(pid))

      if(!deleteProduct){
        return
      }else{
        cart.products = cart.products.filter(element => element.idProduct !== parseInt(pid));
        await fs.promises.writeFile(this.path, JSON.stringify(carts, "utf-8", "\t"));
        return cart
      }

    }catch(err){
      console.log(err)
    }
  }

  async modifyProductFromCart(cid ,pid , cantidad){
    try {
      const carts = await this.getCarts()
      const cart = carts.find(element => element.id === parseInt(cid))
      const product = cart.products.find(element => element.idProduct === parseInt(pid))
      if(!product){
        return
      }else{
        product.cantidad = cantidad
        await fs.promises.writeFile(this.path, JSON.stringify(carts, "utf-8", "\t"));
        return cart
      }
    } catch (error) {
      console.log(error)
    }
  }

  async modifyCart(cid, newCart){
    try {
      const carts = await this.getCarts()
      const cart = carts.find(element => element.id === parseInt(cid))
      if(!cart){
        return
      }else{
        cart.products = newCart
        await fs.promises.writeFile(this.path, JSON.stringify(carts, "utf-8", "\t"));
        return cart
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports= CartDaoFile