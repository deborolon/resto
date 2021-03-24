const app = require("../app");
const sequelize = require("../server");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

//GET ALL
app.get("/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT status.name, orders.created_at, order_details.id,
            order_details.quantity, products.description, payment_methods.method,
            SUM(products.price*order_details.quantity) AS total, users.fullname, users.address
            FROM orders
            JOIN status ON orders.status_id = status.id
            JOIN order_details ON orders.id = order_details.id
            JOIN products ON order_details.product_id = products.id
            JOIN payment_methods ON orders.payment_id = payment_methods.id
            JOIN users ON orders.user_id = users.id
            ORDER BY orders.created_at DESC;`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

//GET BY ID
app.get("/orders/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT status.name, orders.created_at, order_details.id,
            order_details.quantity, products.description, payment_methods.method,
            SUM(products.price*order_details.quantity) AS total, users.fullname, users.address
            FROM orders
            JOIN status ON orders.status_id = status.id
            JOIN order_details ON orders.id = order_details.id
            JOIN products ON order_details.product_id = products.id
            JOIN payment_methods ON orders.payment_id = payment_methods.id
            JOIN users ON orders.user_id = users.id
            WHERE orders.id = :id`,
      {
        replacements: { id: req.params.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

//NEW
app.post("/orders", authMiddleware, async (req, res) => {
  try {
    const { payment_id, status_id, user_id } = req.body;

    await sequelize.query(
      `INSERT into orders
                (payment_id, status_id, user_id)
            VALUES
                (:payment_id, :status_id, :user_id)`,
      { replacements: { payment_id, status_id, user_id } }
    );

    const data = await sequelize.query(`SELECT MAX(id) FROM orders`, {
      type: sequelize.QueryTypes.SELECT,
    });

    const lastId = Object.values(data[0])[0];
    const { order_id, product_id, quantity } = req.body;

    async function orderDetails() {
      await sequelize.query(
        `
                INSERT INTO order_details
                (order_id, product_id, quantity)
                VALUES 
                (?, ?, ?)`,
        { replacements: [lastId, product_id, quantity] }
      );
    }

    orderDetails();
    res.status(200).send("The order has been added.");
  } catch (err) {
    res.send(err);
  }
});

//UPDATE BY ID
app.put("/orders/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { payment_id, status_id, user_id } = req.body;

    await sequelize.query(
      `UPDATE orders SET
            payment_id = ?,
            status_id = ?,
            user_id = ?
        WHERE id = ${req.params.id}`,
      { replacements: [payment_id, status_id, user_id] }
    );

    res.status(200).send("The order has been modified.");
  } catch (err) {
    res.send(err);
  }
});

//DELETE BY ID
app.delete("/orders/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await sequelize.query(`DELETE from orders WHERE id = :id`, {
      replacements: { id: parseInt(req.params.id) },
    });

    res.status(200).send("The order has been deleted.");
  } catch (err) {
    res.send(err);
  }
});
