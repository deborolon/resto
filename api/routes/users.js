const app = require("../app");
const sequelize = require("../server");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const config = require("../config");
const jwt = require("jsonwebtoken");

//LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await sequelize.query(
      `SELECT users.*, user_role.role
            FROM users
            JOIN user_role ON users.role_id = user_role.id
            WHERE username = ? AND password = ?`,
      { replacements: [username, password], type: sequelize.QueryTypes.SELECT }
    );

    if (data.length) {
      const token = jwt.sign(
        {
          username: data[0].username,
          role: data[0].role,
        },
        config.firm
      );

      res.send({
        username: data[0].username,
        token,
      });
    } else {
      res.status(400).send("The username or password is incorrect.");
    }
  } catch (err) {
    res.send(err);
  }
});

//GET ALL
app.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let data = await sequelize.query("SELECT * FROM users", {
      type: sequelize.QueryTypes.SELECT,
    });

    res.send(data);
  } catch (err) {
    res.send(err);
  }
});

//GET BY ID
app.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    let data = await sequelize.query("SELECT * from users WHERE id = :id", {
      replacements: { id: req.params.id },
      type: sequelize.QueryTypes.SELECT,
    });
    res.send(data[0]);
  } catch (err) {
    res.send(err);
  }
});

//NEW ADMINISTRATOR
app.post("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, password, fullname, email, phone, address } = req.body;

    await sequelize.query(
      `INSERT into users
                (username, password, fullname, email, phone, address, role_id)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)`,
      { replacements: [username, password, fullname, email, phone, address, 1] }
    );
    res
      .status(200)
      .send("The user was added to the list of assigned administrators.");
  } catch (err) {
    res.send(err);
  }
});

//NEW USER
app.post("/signup", async (req, res) => {
  try {
    const { username, password, fullname, email, phone, address } = req.body;

    await sequelize.query(
      `INSERT into users
                (username, password, fullname, email, phone, address, role_id)
            VALUES
                (?, ?, ?, ?, ?, ?, ?)`,
      { replacements: [username, password, fullname, email, phone, address, 2] }
    );

    res.status(200).send("The user was added.");
  } catch (err) {
    res.send(err);
  }
});

//UPDATE BY ID
app.put("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      username,
      password,
      fullname,
      email,
      phone,
      address,
      role_id,
    } = req.body;

    await sequelize.query(
      `UPDATE users SET
            username = ?,
            password = ?,
            fullname = ?,
            email = ?, 
            phone = ?,
            address = ?,
            role_id = ?
        WHERE id = ${req.params.id}`,
      {
        replacements: [
          username,
          password,
          fullname,
          email,
          phone,
          address,
          role_id,
        ],
      }
    );

    res.status(200).send("The user was modified.");
  } catch (err) {
    res.send(err);
  }
});

//DELETE BY ID
app.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await sequelize.query(`DELETE from users WHERE id = :id`, {
      replacements: { id: parseInt(req.params.id) },
    });

    res.status(200).send("The user was deleted");
  } catch (err) {
    res.send(err);
  }
});
