import React, { useState } from 'react'
import { useAuth } from '../AuthProvider'
import NavBar from '../NavBar'

const Login = () => {
    const [input, setInput] = useState({
        username: '',
        password: ''
    })

    const auth = useAuth()

    const handleSubmitEvent = (e) => {
        e.preventDefault()
        if (input.username !== '' & input.password !== '') {
            auth.login(input)
            return
        }
        alert('Please provide a vallid input')
    }

    const handleInput = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className={'mainContainer'}>
            <div className={'titleContainer'}>
                <div>Login</div>
                <p> Welcome </p>
            </div><br />

            <div className={'inputContainer'}>
                <form onSubmit={handleSubmitEvent}>
                    <div className='formControl'>
                        <label htmlFor='uername'>Username:</label>
                        <input type='username' id='username' name='username' onChange={handleInput} />
                    </div>

                    <div className='formControl'>
                        <label htmlFor='password'>Password:</label>
                        <input type='password' id='password' name='password' onChange={handleInput} />
                    </div>

                    <button className='submitButtton'>Submit</button>
                </form>
            </div>
        </div>  
    )
}

export default Login