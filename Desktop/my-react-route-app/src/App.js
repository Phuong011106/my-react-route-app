import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navigation from './Components/Navigation'; 
import Players from './Components/Players';      
import Detail from './Components/Detail';        
import Contact from './Components/Contact';     
import Footer from './Components/Footer';      
import './App.css';   
function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path='/' element={<Players />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;