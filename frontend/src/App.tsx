import React from 'react';
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Employee from "./pages/Employee.tsx";
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from "./components/PrivateRoute.tsx";

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='/' element={<PrivateRoute><Home /></PrivateRoute>}/>
      <Route path='/employeeManagement' element={<PrivateRoute><Employee /></PrivateRoute>}/>
    </Routes>
  );
}

export default App;
