import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.json());

mongoose.connect('mongodb://mongo:27017/users')
    .then(() => console.log("MongoDB Connected")
    ).catch((error) => {
        console.log("MongoDB Connection Error", error)

    });


const UserSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', UserSchema);


app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
})

app.post('/', async (req, res) => {
    const { name, email } = req.body;

    try {

        const user = new User({ name, email })
        await user.save();

        res.status(201).json({ Users: user })

    } catch (error) {
        console.error("Error while saving: ", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

app.get('/', (req, res) => {
    res.send('Dwaipayan Biswas');
})

app.listen(3000, () => {
    console.log("Server Running on 3000");

})