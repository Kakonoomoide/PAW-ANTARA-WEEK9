const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/auth.middleware");
const {
  getProducts,
  createProductForm,
  storeProduct,
  editProductForm,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// semua route product wajib login dulu
router.use(requireAuth);

router.get("/", getProducts);
router.get("/create", createProductForm);
router.post("/", storeProduct);
router.get("/:id/edit", editProductForm);
router.post("/:id/update", updateProduct);
router.post("/:id/delete", deleteProduct);

module.exports = router;
