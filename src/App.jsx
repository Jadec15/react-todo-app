import { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");

  // Load tasks from localStorage on first render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    setTasks(savedTasks);
    setCompletedTasks(savedCompletedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [tasks, completedTasks]);

  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, { text: task, category, dueDate }]);
      setTask("");
      setDueDate("");
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const undoTask = (index) => {
    const taskToUndo = completedTasks[index];
    setTasks([...tasks, taskToUndo]);
    setCompletedTasks(completedTasks.filter((_, i) => i !== index));
  };

  const startEditing = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[editIndex].text = editText;
    setTasks(updatedTasks);
    setEditIndex(null);
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>

      {/* Task Input */}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task here"
      />

      {/* Category Dropdown */}
      <p className="field-label">Category</p>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Personal">Personal</option>
        <option value="Work">Work</option>
        <option value="Shopping">Shopping</option>
      </select>

      {/* Due Date Input */}
      <p className="field-label">Due Date</p>
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

      <button onClick={addTask}>Add Task</button>

      <h2 className="active-tasks-title">Active Tasks</h2>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={saveEdit}>💾 Save</button>
              </>
            ) : (
              <>
                {t.text} ({t.category}) {t.dueDate && `- Due: ${t.dueDate}`}
                <button onClick={() => completeTask(index)}>✅</button>
                <button onClick={() => deleteTask(index)}>❌</button>
                <button onClick={() => startEditing(index, t.text)}>✏️ Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Completed Tasks Dropdown */}
      <button onClick={() => setShowCompleted(!showCompleted)}>
        {showCompleted ? "Hide Completed Tasks ⬆" : "Show Completed Tasks ⬇"}
      </button>

      {showCompleted && (
        <div className="completed-section">
          <h2>Completed Tasks</h2>
          <ul>
            {completedTasks.map((t, index) => (
              <li key={index} className="completed-task">
                {t.text} ({t.category}) {t.dueDate && `- Due: ${t.dueDate}`}
                <button onClick={() => undoTask(index)}>↩ Undo</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;




