import React from 'react';
import ReactDOM from 'react-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import EditPresentation from './components/EditPresentation';
import PresentationPreview from './components/PresentationPreview';
import SlideRearrangeScreen from './components/SlideRearrangeScreen'; // Corrected import name

export default function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={ <Login />} />
        <Route path="/Dashboard" element={ <Dashboard />} />
        <Route path="/Register" element={ <Register />} />
        <Route path="/EditPresentation/:presentationId/" element={<EditPresentation />} />
        <Route path="/PresentationPreview" element={<PresentationPreview />} />
        <Route path="/SlideRearrangeScreen" element={<SlideRearrangeScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
