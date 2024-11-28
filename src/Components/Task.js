import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { Draggable } from "react-beautiful-dnd";
import "./LoginSignup.css";

function Task({ list }) {
  const [newTask, setNewTask] = useState({
    id: `${Date.now()}`, // unique ID based on timestamp
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  const [tasks, setTasks] = useState([]); // State to store task details
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch task details when the list is updated (task IDs inside taskLists)
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        // Fetch task details using task IDs from the list
        const taskDocs = await Promise.all(
          list.tasks.map(async (taskId) => {
            const taskDocRef = doc(db, "tasks", taskId); // Reference to the task document
            const taskDoc = await getDoc(taskDocRef);
            if (taskDoc.exists()) {
              return { id: taskDoc.id, ...taskDoc.data() };
            } else {
              console.log("No such task found!");
              return null;
            }
          })
        );
        setTasks(taskDocs.filter((task) => task !== null)); // Filter out null values
        setLoading(false); // Set loading to false after tasks are fetched
      } catch (error) {
        console.error("Error fetching task details: ", error);
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [list.tasks]);

  // Add a new task to the task list
  const addTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      alert("Please fill all task fields.");
      return;
    }

    try {
      // Add a new task document to Firestore
      const taskRef = await addDoc(collection(db, "tasks"), {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        createdBy: list.createdBy,
        creationTime: serverTimestamp(),
      });

      // Add task ID to the task list
      const listRef = doc(db, "taskLists", list.id); // Reference to the task list
      await updateDoc(listRef, {
        tasks: arrayUnion(taskRef.id), // Store task reference ID
      });

      // Reset the task input fields
      setNewTask({
        id: `${Date.now()}`,
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  return (
    <div>
      {/* Form to Add a New Task */}
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Task Description"
        value={newTask.description}
        onChange={(e) =>
          setNewTask({ ...newTask, description: e.target.value })
        }
      />
      <input
        type="date"
        value={newTask.dueDate}
        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
      />
      <select
        value={newTask.priority}
        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button onClick={addTask}>Add Task</button>

      {/* List of Tasks with Drag-and-Drop Functionality */}
      <div className="tasksList">
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          tasks.map((task, index) => (
            <Draggable draggableId={task.id} index={index} key={task.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="taskInnerbox"
                >
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <p>Due Date: {task.dueDate}</p>
                  <p>Priority: {task.priority}</p>
                </div>
              )}
            </Draggable>
          ))
        )}
      </div>
    </div>
  );
}

export default Task;
