const { Product } = require("../models");

// GET /products -> tampilkan semua produk milik user yg login (render EJS)
async function getProducts(req, res) {
  try {
    const products = await Product.findAll({
      where: { user_id: req.session.userId },
      order: [["createdAt", "DESC"]],
    });

    return res.render("products/index", {
      products,
      user: req.session.username,
      title: "Daftar Produk",
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (err) {
    return res.render("products/index", {
      products: [],
      user: req.session.username,
      title: "Daftar Produk",
      success: null,
      error: err.message,
    });
  }
}

// GET /products/create -> tampilkan form tambah produk
function createProductForm(req, res) {
  return res.render("products/create", {
    user: req.session.username,
    title: "Tambah Produk",
    error: null,
    old: {},
  });
}

// POST /products -> simpan produk baru
async function storeProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price) {
      return res.render("products/create", {
        user: req.session.username,
        title: "Tambah Produk",
        error: "Nama dan harga produk wajib diisi",
        old: req.body,
      });
    }

    await Product.create({
      name,
      description: description || null,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category: category || null,
      user_id: req.session.userId,
    });

    return res.redirect("/products?success=Produk berhasil ditambahkan");
  } catch (err) {
    return res.render("products/create", {
      user: req.session.username,
      title: "Tambah Produk",
      error: err.message,
      old: req.body,
    });
  }
}

// GET /products/:id/edit -> tampilkan form edit produk
async function editProductForm(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id, user_id: req.session.userId },
    });

    if (!product) {
      return res.redirect("/products?error=Produk tidak ditemukan");
    }

    return res.render("products/edit", {
      user: req.session.username,
      title: "Edit Produk",
      product,
      error: null,
    });
  } catch (err) {
    return res.redirect("/products?error=" + err.message);
  }
}

// POST /products/:id/update -> update produk
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findOne({
      where: { id, user_id: req.session.userId },
    });

    if (!product) {
      return res.redirect("/products?error=Produk tidak ditemukan");
    }

    if (!name || !price) {
      return res.render("products/edit", {
        user: req.session.username,
        title: "Edit Produk",
        product,
        error: "Nama dan harga produk wajib diisi",
      });
    }

    product.name = name;
    product.description = description || null;
    product.price = parseFloat(price);
    product.stock = parseInt(stock) || 0;
    product.category = category || null;
    await product.save();

    return res.redirect("/products?success=Produk berhasil diupdate");
  } catch (err) {
    return res.redirect("/products?error=" + err.message);
  }
}

// POST /products/:id/delete -> hapus produk
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id, user_id: req.session.userId },
    });

    if (!product) {
      return res.redirect("/products?error=Produk tidak ditemukan");
    }

    await product.destroy();

    return res.redirect("/products?success=Produk berhasil dihapus");
  } catch (err) {
    return res.redirect("/products?error=" + err.message);
  }
}

module.exports = {
  getProducts,
  createProductForm,
  storeProduct,
  editProductForm,
  updateProduct,
  deleteProduct,
};
