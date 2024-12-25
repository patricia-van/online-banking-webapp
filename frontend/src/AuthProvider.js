import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken)
                setUser(Number(decoded.sub))
                setToken(storedToken)
            } catch (err) {
                console.error("Invalid token");
                localStorage.removeItem('token'); // Clear invalid tokens
            }
        }
    }, [])

    const login = async (data) => {
        try {
            const response = await fetch ('/auth/login', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify(data),
            })   
            const res = await response.json();
            if (res.access_token) {

                const decoded = jwtDecode(res.access_token)
                console.log(res)
                console.log(decoded)

                setUser(decoded.sub);
                setToken(res.access_token);
                localStorage.setItem('token', res.access_token);

                navigate('/dashboard')

                return
            }
        } catch (err) {
            console.error(err)
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        navigate('/')
    }

    return <AuthContext.Provider value={{token, user, login, logout}}>
        {children}
    </AuthContext.Provider>
}
export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext);
}