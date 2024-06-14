import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LogIn from './components/LogIn/LogIn';
import Registration from './components/Registration/Registration';
import ResetPassword from './components/ResetPassword/ResetPassword';
import UserDashBoard from './components/UserDashBoard/UserDashBoard';
import AdminDashBoard from './components/AdminDashBoard/AdminDashBoard';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LogIn/>} />
          <Route path='/Registration' element={<Registration/>} />
          <Route path='/Forgot-password' element={<ResetPassword/>} />
          <Route path='/user-dashboard' element={<UserDashBoard/>} />
          <Route path='/admin-dashboard' element={<AdminDashBoard/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
