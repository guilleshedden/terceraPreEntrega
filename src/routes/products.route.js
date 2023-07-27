const {Router} = require("express")
const productController = require("../controllers/product.controller");
const { passportCall } = require("../config/passportCall");
const { authorization } = require("../config/authorizationjwtRole");
const router = Router()

router.get("/mockingproducts", productController.generateProductsMock)

router.get("/", productController.getProducts);

router.post("/" ,passportCall("current", {session: false}), authorization(["admin", "premium"]), productController.createProduct);

router.get("/:pid", productController.getProductById);

router.put("/:pid",passportCall("current", {session: false}), authorization("admin"), productController.updateProduct);

router.delete("/:pid",passportCall('current', {session: false}), authorization(["admin", "premium"]), productController.deleteProduct);


module.exports= router;