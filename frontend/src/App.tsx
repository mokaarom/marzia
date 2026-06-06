import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Landing = lazy(() => import('./pages/Landing'));
const Editor = lazy(() => import('./pages/Editor'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#111111] rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;