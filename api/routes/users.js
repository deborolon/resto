const app = require('../app');
const dbConnection = require('../server');

//GET ALL
app.get('/users', async  (req, res) => {
    try{
        let data = await dbConnection.sq.query(
            'SELECT * FROM users',
            {
                type: dbConnection.sq.QueryTypes.SELECT
            })
        res.send(data);
    } catch(err){
        console.log(err);
        res.send(err);
    }
});

//GET BY ID
app.get('/users/:id', async  (req, res) => {
    try{
        let data = await dbConnection.sq.query(
            'SELECT * from users WHERE id = :id',
            {
                replacements: {id: req.params.id}
            })
        res.send(data);
    } catch(err){
        console.log(err);
        res.send(err);
    }
});

//NEW
app.post('/users', async (req, res) => {
    try{
        const { username, password, fullname, email, phone, address, role_id} = req.body;

        await dbConnection.sq.query(
            `INSERT into users
                (username, password, fullname, email, phone, address, role_id)
            VALUES
                (:username, :password, :fullname, :email, :phone, :address, :role_id)`,
        { replacements: {username, password, fullname, email, phone, address, role_id} });

        res.sendStatus(200);
    } catch (err){
        res.send(err);
    }
});

//UPDATE BY ID
app.put('/users/:id', async (req, res) => {
    try{
        const { username, password, fullname, email, phone, address, role_id} = req.body;

    await dbConnection.sq.query(
        `UPDATE users SET
            username = ?,
            password = ?,
            fullname = ?,
            email = ?, 
            phone = ?,
            address = ?,
            role_id = ?
        WHERE id = ${req.params.id}`,
        { replacements: [username, password, fullname, email, phone, address, role_id] });

    res.sendStatus(200);
    } catch (err){
        res.send(err);
    }
});

//DELETE BY ID
app.delete('/users/:id', async (req, res) => {
    try{
        await dbConnection.sq.query(
            `DELETE from users WHERE id = :id`,
            {
                replacements: {id: parseInt(req.params.id)}
            },
        );
    
        res.sendStatus(200);
    } catch (err){
        res.send(err);
    }
});