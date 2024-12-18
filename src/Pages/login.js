import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()

    const onButtonClick = () => {
        // Set initial error values to empty
        setEmailError('')
        setPasswordError('')

        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email')
            return
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            return
        }

        if ('' === password) {
            setPasswordError('Please enter a password')
            return
        }

        if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            return
        }

        // Simulate successful login and naviagte to dashboard
        navigate('/dashboard')
    }

    const onTransactionClick = () => {
        navigate('/transactions')
    }

    const [data, setdata] = useState({
        name: "", 
        age: 0,
        data: "",
        programming: ""
      })
    
    useEffect(() => {
        fetch("/data").then((res) => 
          res.json().then((data) => {
            setdata({
              name: data.Name,
              age: data.Age,
              data: data.Date,
              programming: data.programming
            })
          }))
      }, [])

    const [accounts, setAccounts] = useState([]);
    
    useEffect(() => {
        fetch("/api/accounts").then((res) => {
            res.json().then((data) => {
                if (Array.isArray(data)) {
                    setAccounts(data)
                } else {
                    console.error('Received data not an array')
                }
                    
            })
        //     if (!res.ok) {
        //         throw new Error('Network response was not ok')
        //     }
        //     return res.json();
        // }).then((data) => {
        //     setAccounts(data)
        // }).catch((error) => {
        //     console.error('There was a problem with the fecth operation')
        })
    }, [])

    return (
        <div className={'mainContainer'}>
            
            <div className={'titleContainer'}>
                <div>Login</div>
                <p> Welcome {data.name} </p>
                <ul>
                    {accounts.map((account) => (
                        <li key={account.AccountID}>
                            AccountID: {account.AccountID}
                            <br></br>
                            Balance: {account.AccountBalance}
                        </li>
                    ))}
                </ul>
            </div>
            <br />

            <div className={'inputContainer'}>
                <input
                    value={email}
                    placeholder='Enter your email here'
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={'inputBox'}
                />
                <label className='errorLabel'>{emailError}</label>
            </div>
            <br />

            <div className={'inputContainer'}>
                <input
                    value={password}
                    placeholder='Enter your password here'
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={'inputBox'}
                />
                <label className='errorLabel'>{passwordError}</label>
            </div>
            <br />

            <div className={'inputContainer'}>
                <input className={'inputButton'} type='button' onClick={onButtonClick} value={'Login'} />
                <input className={'transactionsButton'} type='button' onClick={onTransactionClick} value={'Manage my Transactions'} />
            </div>

        </div>  
    )
}

export default Login