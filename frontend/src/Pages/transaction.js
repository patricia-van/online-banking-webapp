import { formDataToBlob } from "formdata-polyfill/esm.min";
import React, { use, useEffect, useState} from "react";

const ManageTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        date:'',
        amount:0,
        comment:''
    })

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
        setShowForm(true)
    }

    const handleDeleteTransaction = () => [
        alert('Transaction deleted')
    ]

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleNewTransactionSubmit = (e) => {
        e.preventDefault()
        const newTransaction = {
            data: formData.date,
            amount: parseFloat(formData.amount),
            comment: formData.comment
        }
        setShowForm(false)
        setFormData({ date:'', amount: 0, description:'' });
        alert('New transaction scheduled')
    }


    return (
        <div className='manage-transactions'>
            <h1>My Transactions</h1>

            <div className="button-container">
                <button className="create-button" onClick={handleCreateTransaction}>
                    New Transactions
                </button>
                <button className="delete-button" onClick={handleDeleteTransaction}>
                    Delete Transaction
                </button>
            </div>

            {showForm && (
                <div className="popup-newtransaction-form">
                    <h2> Schedule New Transaction </h2>
                    <form onSubmit={handleNewTransactionSubmit}>
                        <div>
                            <label>Date:</label>
                            <input type="date" name="date" value={formData.date} onChange={handleFormChange} required/>
                        </div>
                        <div>
                            <label>Amount:</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} required/>
                        </div>
                        <div>
                            <label>Comments:</label>
                            <input type="text" name='comment' value={formData.comment} onChange={handleFormChange}/>
                        </div>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                </div>
            )}

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