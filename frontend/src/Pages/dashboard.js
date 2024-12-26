import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import AuthProvider from '../AuthProvider';
import { useAuth } from '../AuthProvider';


const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const auth = useAuth()

    useEffect(() => {
        // fetch data for user accounts
        const testAccounts = [
            { id: 1, type: "Checking", balance: 1523.45 },
            { id: 2, type: "Savings", balance: 10234.56 },
            { id: 3, type: "Credit", balance: -500.75 },
        ];

        // fetch data for scheduled transactions
        const testTransactions = [
            { id: 1, date: "2024-12-20", amount: 200.0, description: "Electricity Bill" },
            { id: 2, date: "2024-12-25", amount: 500.0, description: "Rent Payment" },
            { id: 3, date: "2024-12-30", amount: 100.0, description: "Subscription Service" },
        ];

        //fetch both accounts and transactions
        fetch('/api/accounts/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + auth.token,
                'userid': auth.user
            }
        })
        .then(res => res.json())
        .then(accounts => {
            console.log(accounts)
            setAccounts(accounts)

            const accountIds = accounts.map(d => d.AccountID)

            return fetch('/api/transactions/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token,
                },
                body: JSON.stringify({ account_ids: accountIds })
            })
        
        })
        .then(res => res.json())
        .then(transactions => {
            console.log("Transactions:" + transactions)
            setTransactions(transactions)
        })
        .catch(err => console.error(err))
        setLoading(false)

    }, [auth.user, auth.token]);

    if (loading) {
        return <div className='loading'>Loading...</div>
    }

    return (
        <div className='user-dashboard'>
            <AuthProvider>    
            <h1>Welcome to Your Dashboard</h1>
            <h1> { auth.token } </h1>

            <section className='accounts-section container my-4'>
                <h2>Your Accounts</h2>
                {accounts.length > 0 ? (
                    <Row xs={1} md={3} className="g-4">
                        {accounts.map((a) => (
                            <Col key={a.AccountID}>
                                <Card border="#f7f7f7" style={{ width: '24rem' }}>
                                    <Card.Header as="h6">{a.AccountType} Account</Card.Header>
                                    <Card.Body>
                                        <Card.Text className="mb-2 text-muted">Balance:</Card.Text>
                                        <Card.Text as="h3">${a.AccountBalance}</Card.Text>
                                        <Card.Text></Card.Text>
                                        <Card.Text></Card.Text>
                                        <Card.Text as="h7">{a.AccountID}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>No accounts found.</p>
                )}
            </section>

            <section className='transactions-section container my-4'>
                <h2>Scheduled Transactions</h2>
                {transactions.length > 0 ? (
                    <table class="table table-bordered">
                       <thead class="table-light">
                            <th>Account ID</th>
                            <th>Receiving Account ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Comment</th>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.TransactionID}>
                                    <th>{t.AccountID}</th>
                                    <th>{t.ReceivingAccountID}</th>
                                    <th>{new Date(t.Date).toLocaleDateString()} {new Date(t.Date).toLocaleTimeString()}</th>
                                    <th>{t.TransactionAmount}</th>
                                    <th>{t.Comment}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No transactions scheduled.</p>
                )}
            </section>

            <button onClick={() => auth.logout()} className='logout-button'>
                Logout
            </button>
            
            </AuthProvider>
        </div>
    )
}

export default Dashboard;

