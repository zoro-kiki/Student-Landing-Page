import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [filter, setFilter] = useState('All');
  const today = new Date().toISOString().split('T')[0];
  const API_URL = 'https://finaltaskmanager.onrender.com/api/tasks';

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try { const res = await axios.get(API_URL); setTasks(res.data); }
    catch (err) { console.log("Backend error"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = { ...form };
      if (!taskData.dueDate) delete taskData.dueDate;
      await axios.post(API_URL, taskData);
      alert("Task Added Successfully! ✅");
      setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggle = async (task) => {
    await axios.put(`${API_URL}/${task._id}`, { completed: !task.completed });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete?")) { await axios.delete(`${API_URL}/${id}`); fetchTasks(); }
  };

  const filtered = tasks.filter(t => filter === 'All' ? true : filter === 'Pending' ? !t.completed : t.completed);

  const scrollToApp = () => {
    document.getElementById('task-app-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="main-wrapper">

      {/* --- HERO SECTION WITH ANIMATION (Class: animate-delay-1) --- */}
      <header className="animate-delay-1" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        borderRadius: '0 0 50px 50px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 20px 0', fontWeight: 'bold' }}>
          Organize Your Student Life 🚀
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 30px', opacity: '0.9' }}>
          Stay on top of assignments, exams, and daily tasks. <br />
          Simple. Fast. Cloud-Synced.
        </p>
        <button
          onClick={scrollToApp}
          style={{
            padding: '15px 45px',
            fontSize: '1.2rem',
            borderRadius: '30px',
            border: 'none',
            background: 'white',
            color: '#764ba2',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }}
        >
          Get Started Free
        </button>
      </header>

      {/* --- NEW: WHY CHOOSE US (Class: animate-delay-2) --- */}
      <div className="animate-delay-2" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
        <div className="features-grid">
          <div className="feature-card">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
            <h3>Fast & Simple</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>No confusing menus. Just add tasks and get work done.</p>
          </div>
          <div className="feature-card">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>☁️</div>
            <h3>Cloud Synced</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Access your tasks from any device, anywhere.</p>
          </div>
          <div className="feature-card">
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎯</div>
            <h3>Track Progress</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Filter by Pending or Completed to stay focused.</p>
          </div>
        </div>
      </div>

      {/* --- APP PREVIEW SECTION (Class: animate-delay-3) --- */}
      <div id="task-app-section" className="container animate-delay-3">
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '10px', marginTop: '40px' }}>
          Live App Preview
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Try adding a task below to see how it works!
        </p>

        <div className="form-box">
          <form onSubmit={handleSubmit}>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task Title (e.g. Math Assignment)" required />
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" />
            <div className="row" style={{ display: 'flex', gap: '10px' }}>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="medium">Medium Priority</option><option value="high">High Priority</option><option value="low">Low Priority</option>
              </select>
              <input
                type="date"
                min={today}
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <button type="submit" style={{ marginTop: '15px' }}>Add Task</button>
          </form>
        </div>

        <div className="filters">
          <button onClick={() => setFilter('All')}>All</button>
          <button onClick={() => setFilter('Pending')}>Pending</button>
          <button onClick={() => setFilter('Completed')}>Completed</button>
        </div>

        <div className="task-list">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#aaa' }}>No tasks found. Add one above! 👆</p>
          ) : (
            filtered.map(t => (
              <div key={t._id} className={`task-card ${t.priority} ${t.completed ? 'completed' : ''}`}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{t.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{t.description}</p>
                </div>
                <div>
                  <button onClick={() => handleToggle(t)} style={{ background: t.completed ? '#aaa' : '#1dd1a1', fontSize: '0.8rem', padding: '5px 10px', marginRight: '5px' }}>
                    {t.completed ? 'Undo' : 'Done'}
                  </button>
                  <button onClick={() => handleDelete(t._id)} style={{ background: '#ff6b6b', fontSize: '0.8rem', padding: '5px 10px' }}>Del</button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '20px', color: '#888', fontSize: '0.9rem' }}>
          <p>Created with ❤️ by Zaara | Powered by React & Node.js</p>
        </footer>
      </div>

    </div>
  );
}

export default App;