import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [filter, setFilter] = useState('All'); 
  const API_URL = 'http://localhost:5000/api/tasks';

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try { const res = await axios.get(API_URL); setTasks(res.data); } 
    catch (err) { console.log("Backend error"); }
  };

// Updated Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Date fix: Agar date khali hai, toh use mat bhejo
      const taskData = { ...form };
      if (!taskData.dueDate) delete taskData.dueDate;

      // 2. Data bhejo
      await axios.post(API_URL, taskData);
      
      // 3. Success Message
      alert("Task Added Successfully! ✅");
      
      // 4. Reset Form
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' }); 
      fetchTasks();
      
    } catch (err) { 
      console.error(err);
      // 5. Error dikhao taaki pata chale kya hua
      alert("Error: " + (err.response?.data?.message || err.message)); 
    }
  };

  const handleToggle = async (task) => {
    await axios.put(`${API_URL}/${task._id}`, { completed: !task.completed });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if(confirm("Delete?")) { await axios.delete(`${API_URL}/${id}`); fetchTasks(); }
  };

  const filtered = tasks.filter(t => filter === 'All' ? true : filter === 'Pending' ? !t.completed : t.completed);

  return (
    <div className="container">
      <h1>Student Task Manager </h1>
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Task Title" required />
          <input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" />
          <div className="row">
            <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
              <option value="medium">Medium</option><option value="high">High</option><option value="low">Low</option>
            </select>
            <input type="date" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} />
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div className="filters">
        <button onClick={()=>setFilter('All')}>All</button>
        <button onClick={()=>setFilter('Pending')}>Pending</button>
        <button onClick={()=>setFilter('Completed')}>Completed</button>
      </div>
      <div className="task-list">
        {filtered.map(t => (
          <div key={t._id} className={`task-card ${t.priority} ${t.completed ? 'completed' : ''}`}>
            <div><h3>{t.title}</h3><p>{t.description}</p></div>
            <div>
              <button onClick={()=>handleToggle(t)}>{t.completed?'Undo':'Done'}</button>
              <button onClick={()=>handleDelete(t._id)} style={{background:'red', marginLeft:'5px'}}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;