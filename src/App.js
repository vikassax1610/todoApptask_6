// src/App.js
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import LoginSignup from "./Components/Login";
import ToDoList from "./Components/ToDoList";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state on logout
      alert("Logged out successfully!");
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  return (
    <div className="app">
      {user ? (
        <div>
          <div className="Welcome">
            <h2>{user.email}</h2>
            <button id="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <ToDoList user={user} />
        </div>
      ) : (
        <LoginSignup setUser={setUser} />
      )}
    </div>
  );
}

export default App;
