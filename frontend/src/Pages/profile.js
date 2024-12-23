import { useState, useEffect } from 'react'
import { useAuth } from '../AuthProvider';
import { data } from 'react-router-dom';


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
        fetch(`/api/user/${auth.token}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setUser(data)
        })
        .catch(err => console.log(err))
    }, [auth.token])

    // const handleChange = (e) => {
    // }

    return (
        <div>
            <h1> My Profile </h1>
            <form>
                <label>
                    Username:
                    <input type='text' value={user.Username} disabled />
                </label>
                <br></br>
                <label>
                    First Name:
                    <input type='text' value={user.Firstname} disabled />
                </label>
                <br></br>
                <label>
                    Last Name:
                    <input type='text' value={user.Lastname} disabled />
                </label>
                <br></br>
                <label>
                    Email:
                    <input type='text' value={user.Email} disabled />
                </label>
                <br></br>
                <label>
                    Address:
                    <input type='text' value={user.Address} disabled />
                </label>
            </form>
        </div>

    )
}

export default Profile

