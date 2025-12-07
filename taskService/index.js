import express from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());


mongoose.connect('mongodb://mongo:27017/tasks')
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log("MongoDB Connection Error:", error));


const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model('Task', TaskSchema);

let channel, connection;
async function connectRabbitMQRetry(retries = 5, delay = 3000) {
    
}


app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});



app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;

    try {
        const task = new Task({
            title,
            description,
            userId: uuidv4(),
        });

        await task.save();

        res.status(201).json({ task });
    } catch (error) {
        console.error("Error while saving:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/', (req, res) => {
    res.send('Dwaipayan Biswas');
});



app.listen(3002, () => {
    console.log("Server Running on port 3002");
});
