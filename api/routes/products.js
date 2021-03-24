const app = require("../app");
const sequelize = require("../server");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

//GET ALL
app.get("/", authMiddleware, async (req, res) => {
  try {
    let data = await sequelize.query("SELECT * FROM products", {
      type: sequelize.QueryTypes.SELECT,
    });
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

//GET BY ID
app.get("/products/:id", authMiddleware, async (req, res) => {
  try {
    let data = await sequelize.query("SELECT * from products WHERE id = :id", {
      replacements: { id: req.params.id },
      type: sequelize.QueryTypes.SELECT,
    });
    res.send(data[0]);
  } catch (err) {
    res.send(err);
  }
});

//NEW
app.post("/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { description, picture, price } = req.body;

    await sequelize.query(
      `INSERT into products
                (description, picture, price)
            VALUES
                (:description, :picture, :price)`,
      { replacements: { description, picture, price } }
    );

    res.status(200).send("Product has been added.");
  } catch (err) {
    res.send(err);
  }
});

//UPDATE BY ID
app.put("/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { description, picture, price } = req.body;

    await sequelize.query(
      `UPDATE products SET
            description = ?,
            picture = ?,
            price = ?
        WHERE id = ${req.params.id}`,
      { replacements: [description, picture, price] }
    );

    res.status(200).send("The product has been modified.");
  } catch (err) {
    res.send(err);
  }
});

//DELETE BY ID
app.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await sequelize.query(`DELETE from products WHERE id = :id`, {
        replacements: { id: parseInt(req.params.id) },
      });

      res.status(200).send("The product has been removed.");
    } catch (err) {
      res.send(err);
    }
  }
);