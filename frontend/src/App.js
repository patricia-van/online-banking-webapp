import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import AuthProvider from './AuthProvider'
import PrivateRoute from './PrivateRoute'
import Login from './Pages/login'
import Dashboard from './Pages/dashboard'
import ManageTransactions from './Pages/transaction'
import Profile from './Pages/profile'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className='App'>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path='/'
              element={<Login setLogginedIn={setLoggedIn} setEmail={setEmail} />}
            />

            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route 
              path='/transactions' 
              element={<ManageTransactions />}
            />

          <Route 
              path='/profile' 
              element={<Profile />}
            />  

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
