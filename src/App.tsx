import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main/Main';
import CreateSurvey from './pages/CreateSurvey/CreateSurvey';
import Survey from './pages/Survey/Survey';
import Result from './pages/Result/Result';
import ResultDetail from './pages/ResultDetail/ResultDetail';
import PreInquiry from './pages/PreInquiry/PreInquiry';
import Hospital from './pages/Hospital/Hospital';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Main />} />
                    <Route path='/create-question' element={<CreateSurvey />} />
                    <Route path='/survey/:id' element={<Survey />} />
                    <Route path='/result/:id' element={<Result />} />
                    <Route
                        path='/result/:surveyId/:answerId'
                        element={<ResultDetail />}
                    />
                    <Route path='/pre-inquiry' element={<PreInquiry />} />
                    <Route path='/hospital' element={<Hospital />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
