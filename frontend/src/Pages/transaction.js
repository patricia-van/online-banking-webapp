import React, { useEffect, useState} from "react";

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        //fetch data for user transactions
        const testTransactions = [
            { id: 1, date: "2024-12-20", amount: 200.0, description: "Electricity Bill" },
            { id: 2, date: "2024-12-25", amount: 500.0, description: "Rent Payment" },
            { id: 3, date: "2024-12-30", amount: 100.0, description: "Subscription Service" },
        ];

        setTransactions(testTransactions);
    }, []);

    const handleCreateTransaction = () => {
        alert('New transaction scheduled')
    }

    const handleDeleteTransaction = () => [
        alert('Transaction deleted')
    ]


    return (
        <div className='manage-transactions'>
            <h1>My Transactions</h1>

            <div className="button-container">
                <button className="create-button" onClick={handleCreateTransaction}>New Transactions</button>
                <button className="delete-button" onClick={handleDeleteTransaction}>Delete Transaction</button>
            </div>

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
        </div>
    )

}

export default ManageTransactions