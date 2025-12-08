
import { useState } from 'react'
import Login from './pages/auth/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <Login />
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard!</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default App