import React, { useEffect, useState } from 'react';
import AuthProvider from '../AuthProvider';
import { useAuth } from '../AuthProvider';
// import dashboard.css

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
           
        // Simulate data load
        setTimeout(() => {
            setAccounts(testAccounts);
            setTransactions(testTransactions);
            setLoading(false);
          }, 1000);
    }, []);

    if (loading) {
        return <div className='loading'>Loading...</div>
    }

    return (
        <div className='user-dashboard'>
            <AuthProvider>    
            <h1>Welcome to Your Dashboard</h1>

            <section className='accounts-section'>
                <h2>Your Accounts</h2>
                {accounts.length > 0 ? (
                    <table className='accounts-table'>
                        <thead>
                            <tr>
                                <th>Account Type</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.type}</td>
                                    <td>{a.balance.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No accounts found.</p>
                )}
            </section>

            <section className='transactions-section'>
                <h2>Scheduled Transactions</h2>
                {transactions.length > 0 ? (
                    <table className='transactions-table'>
                        <thead>
                            <th>Date</th>
                            <th>Amount</th>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id}>
                                    <th>{t.date}</th>
                                    <th>{t.amount}</th>
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

