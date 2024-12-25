import { useState, useEffect } from 'react'
import { useAuth } from '../AuthProvider';

const Profile = () => {
    const [ user, setUser ] = useState({
        'Username': '',
        'Firstname': '',
        'Lastname': '',
        'Email': '',
        'Address': '',
        'OptIntoPhyStatements': '',
    })
    const auth = useAuth()

    useEffect(() => {
        console.log(auth.token)
        //fetch user information
        fetch(`/api/user/${auth.user}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + auth.token,
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setUser(data)
        })
        .catch(err => console.log(err))
    }, [auth.user, auth.token])

    const handleChange = (e) => {
        const { name, value } = e.target
        setUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(`api/user/${auth.user}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth.token,
            },
            body: JSON.stringify({
                Email: user.Email,
                Address: user.Address
            })
        })
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(err => console.log(err.message))
    }

    return (
        <div>
            <h1> My Profile </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type='text' value={user.Username} name='Username' disabled />
                </label>
                <br></br>
                <label>
                    First Name:
                    <input type='text' value={user.Firstname} name='Firstname' disabled />
                </label>
                <br></br>
                <label>
                    Last Name:
                    <input type='text' value={user.Lastname} name='Lastname' disabled />
                </label>
                <br></br>
                <label>
                    Email:
                    <input type='text' value={user.Email} name='Email' onChange={handleChange} />
                </label>
                <br></br>
                <label>
                    Address:
                    <input type='text' value={user.Address} name='Address' onChange={handleChange} />
                </label>
                <br></br>
                <button type='submit'>Update</button>
            </form>
        </div>

    )
}

export default Profile

