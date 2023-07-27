const { cartService, productService } = require("../services/Services")
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../utils/nodemailer");
const { logger } = require("../utils/logger");


class CartController{

    createCart = async(req, res)=>{
        try{
            const newCart = {products:[]}
            const result = await cartService.createCart(newCart)
            res.status(201).send({ status: "success", payload: result})
        }catch(error){
            logger.error(error)
        }
    }

    getCarts = async (req, res) => {
        try{
            const carts = await cartService.getCarts()
            !carts
            ?res.status(404).send({error: "no hay carritos"})
            :res.status(201).send({status:"success", payload: carts});  
        } catch(error){
            logger.error(error)
        }
    }

    getCartById = async(req, res)=>{
        try{
            const cid = req.params.cid;
            const cart = await cartService.getCartById(cid);
            !cart
            ?res.status(404).send({ error: `El carrito con ID ${cid} no existe` })
            :res.status(201).send({status: "success", payload: cart})
        } catch(error){
            logger.error(error)
        }
    }

    emptyCart = async(req, res)=>{
        try{
            const cid = req.params.cid
            let respuesta= await cartService.emptyCart(cid)
            !respuesta
            ?res.status(400).send({error:"no se pudo vaciar el carrito"})
            :res.status(200).send({status: "success", payload: respuesta})
        }catch(error){
            logger.error(error)
        }
    }

    deleteProductFromCart = async(req, res)=>{
        try{
            const cid = req.params.cid
            const pid = req.params.pid
            let respuesta = await cartService.deleteProductFromCart(cid,pid)
            !respuesta
            ?res.status(400).send({error:"no se pudo eliminar el producto del carrito"})
            :res.status(200).send({ status:`El producto ID:${pid} se ha eliminado del carrito`, payload: respuesta});
        }catch(error){
            logger.error(error)
        }
    }

    modifyCart = async(req, res)=>{
        try{
            const cid = req.params.cid
            const newCart= req.body
            let respuesta= await cartService.modifyCart(cid, newCart)
            !respuesta
            ?res.status(400).send({error:"No se pudo modificar el carrito"})
            :res.status(200).send({status: "Se ha modificado el carrito", payload: respuesta})
        }catch(error){
            logger.error(error)
        }
    }

    modifyProductFromCart = async(req, res)=>{
        try{
            const cid = req.params.cid
            const pid = req.params.pid
            const {cantidad}= req.body
            let respuesta = await cartService.modifyProductFromCart(cid, pid, cantidad)
            !respuesta
            ?res.status(400).send({error:"no se pudo modificar el producto del carrito"})
            :res.status(200).send({status:`El producto ID:${pid} se ha modificado`, payload: respuesta});
        }catch(error){
            logger.error(error)
        }
    }

    addToCart = async(req, res)=>{
        try{
            const cid = req.params.cid
            const pid = req.params.pid
            const {cantidad}= req.body
            const user = req.session.user
            const product= await productService.getProductById(pid)

            if (product.owner === user.email) {
                return res.status(403).send({ error: "No puedes agregar un producto que te pertenece a tu carrito." });
            }
            
            const addProduct= await cartService.addToCart(cid, pid, cantidad)
            !addProduct
            ?res.status(400).send({error:"no se pudo agregar el producto"})
            :res.status(201).send({status:"success", payload: addProduct})
        }catch(error){
            logger.error(error)
        }
    }

    generateTicket = async (req, res)=>{
        try {
            const cid = req.params.cid
            const cart = await cartService.getCartById(cid)
            const productsWithoutStock = [];
            
            //itero por el carrito y voy validando el stock contra la cantidad
            for (const item of cart.products) {
                let stock = item.product.stock;
                let pid = item.product._id
                if (stock >= item.cantidad) {
                    item.product.stock -= item.cantidad;
                    await productService.updateProduct(pid, item.product)
                } else {
                    productsWithoutStock.push(item);
                }
            }

            //accedo al carrito y filtro basado en la negacion de productsWithoutStock
            //es decir si no esta en productsWithoutStock lo guardo en un array(purchasedProducts)
            const purchasedProducts = cart.products.filter(item =>
                !productsWithoutStock.some(p => p.product._id === item.product._id));

            if (purchasedProducts.length > 0) {
                const ticket = {
                    code: uuidv4(),
                    purchase_datetime: new Date(),
                    amount: purchasedProducts.reduce((total, item) => total + (item.cantidad * item.product.price), 0),
                    purchaser: req.user.email
                };
        
                const createdTicket = await cartService.generateTicket(ticket);
        
                cart.products = productsWithoutStock;
                await cartService.modifyCart(cid, productsWithoutStock );

                if(productsWithoutStock.length > 0){
                    await sendMail(ticket)
                    res.status(201).send({ message: "Compra realizada parcialmente,existen productos sin stock suficiente", ticket: createdTicket });
                }else{
                    await sendMail(ticket)
                    res.status(201).send({ message: "Compra realizada exitosamente", ticket: createdTicket });
                }
        
            } else {
                const productsWithoutStockIds = productsWithoutStock.map(item => item.product._id);
                res.status(200).send({message: "La compra no se pudo completar", payload: productsWithoutStockIds});
            }
        }catch(error){
            logger.error(error)
        }
    }
}

module.exports= new CartController()