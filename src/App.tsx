
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Generator from './pages/Generator';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/docs" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
