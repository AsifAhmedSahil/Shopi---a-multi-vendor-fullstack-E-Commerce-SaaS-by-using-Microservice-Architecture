import express , {Router} from "express"
import { createDiscountCodes, deleteDiscountCode, getCategories, getDiscountCode, uploadProductImage } from "../controllers/product.controllers";
import { isAuthenticated } from "@packages/middleware/isAuthenticated";

const router:Router = express.Router()

router.get("/get-categories",getCategories);
router.post("/create-discount-code",isAuthenticated,createDiscountCodes )
router.get("/get-discount-codes",isAuthenticated,getDiscountCode)
router.delete("/delete-discount-code/:id",isAuthenticated,deleteDiscountCode)
router.post("/upload-product-image",isAuthenticated,uploadProductImage)

export default router;