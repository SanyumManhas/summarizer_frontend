import {Routes, Route} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import History from './History';
import Summary from './Summary';
import ProtectedRoute from './ProtectedRoute';

export default function Links(){
    return(
        <Routes>
            <Route path="/" element={
            <ProtectedRoute>
                <Home/>
            </ProtectedRoute>
            }/>
            <Route path="/home" element={
            <ProtectedRoute>
                <Home/>
            </ProtectedRoute>
            }/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/history" element={ <ProtectedRoute>
                <History/>
            </ProtectedRoute>}/>
            <Route path="/summary" element={ <ProtectedRoute>
                <Summary/>
            </ProtectedRoute>}/>
        </Routes>
    )
}