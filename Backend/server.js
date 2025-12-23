require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection




mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('MongoDB Error:', err));

// Schema (Data Model)
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

// Routes (API)

// 1. Get All Tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) { res.status(500).json(err); }
});

// 2. Create Task


app.post('/api/tasks', async (req, res) => {
    try {
        console.log("Received Data:", req.body); // Check karega data aa raha hai ya nahi
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        console.log("Task Saved!");
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("❌ Error Saving Task:", err); // Ye ERROR dikhayega terminal mein
        res.status(500).json({ message: err.message, error: err });
    }
});

// 3. Update Task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) { res.status(500).json(err); }
});

// 4. Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));