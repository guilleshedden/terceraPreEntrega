const { Router }= require("express")
const productsRouter= require("./products.route.js")
const cartRouter = require("./carts.router.js")
const viewsRouter = require("./views.route.js")
const usersRouter= require("./users.router.js")
const { generateProducts } = require("../utils/generateProductsFaker.js")
const router= Router()

router.use("/api/products", productsRouter)

router.use("/", viewsRouter)

router.use("/api/carts", cartRouter)

router.use("/api/session", usersRouter)

module.exports= router