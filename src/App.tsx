import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import CreateSurvey from './pages/CreateSurvey/CreateSurvey';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Main />} />
                    <Route path='/create-question' element={<CreateSurvey />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
