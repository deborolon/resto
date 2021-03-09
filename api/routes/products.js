const app = require('../app');
const dbConnection = require('../server');

//GET ALL
app.get('/products', async  (req, res) => {
    try{
        let data = await dbConnection.sq.query(
            'SELECT * FROM products',
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
app.get('/products/:id', async  (req, res) => {
    try{
        let data = await dbConnection.sq.query(
            'SELECT * from products WHERE id = :id',
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
app.post('/products', async (req, res) => {
    try{
        const { description, picture, price} = req.body;

        await dbConnection.sq.query(
            `INSERT into products
                (description, picture, price)
            VALUES
                (:description, :picture, :price)`,
        { replacements: {description, picture, price} });

        res.sendStatus(200);
    } catch (err){
        res.send(err);
    }
});

//UPDATE BY ID
app.put('/products/:id', async (req, res) => {
    try{
        const { description, picture, price} = req.body;

    await dbConnection.sq.query(
        `UPDATE products SET
            description = ?,
            picture = ?,
            price = ?
        WHERE id = ${req.params.id}`,
        { replacements: [description, picture, price] });

    res.sendStatus(200);
    } catch (err){
        res.send(err);
    }
});

//DELETE BY ID
app.delete('/products/:id', async (req, res) => {
    try{
        await dbConnection.sq.query(
            `DELETE from products WHERE id = :id`,
            {
                replacements: {id: parseInt(req.params.id)}
            },
        );
    
        res.sendStatus(200);
    } catch (err){
        res.send(err);
    }
});