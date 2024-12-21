import { formDataToBlob } from "formdata-polyfill/esm.min";
import React, { use, useEffect, useState} from "react";
import { useAuth } from "../AuthProvider";

const ManageTransactions = () => {
    const [ transactions, setTransactions ] = useState([]);
    const [ showForm, setShowForm ] = useState(false)
    const [ formData, setFormData ] = useState({
        senderAccountId:'',
        receiverAccountId:'',
        date:'',
        time:'',
        amount:'',
        comment:''
    })
    const [ deleteMode, setDeleteMode ] = useState(false)
    const [ selectedTransactions, setSelectedTransactions ] = useState([])
    const [ accountIds, setAccountIds ] = useState([]);

    const auth = useAuth()

    useEffect(() => {
        //fetch data for user transactions
        const testTransactions = [
            { id: 1, date: "2024-12-20", amount: 200.0, description: "Electricity Bill" },
            { id: 2, date: "2024-12-25", amount: 500.0, description: "Rent Payment" },
            { id: 3, date: "2024-12-30", amount: 100.0, description: "Subscription Service" },
        ];

        setTransactions(testTransactions);

        fetch('/api/accounts/dashboard', {
            method: 'GET',
            headers: {
                'userid': auth.token
            }
        })
        .then(res => res.json())
        .then(accounts => {
            console.log(accounts)
            const ids = accounts.map(d => d.AccountID)
            setAccountIds(ids)  
        })

    }, [auth.token]);

    const handleCreateTransaction = () => {
        setShowForm(true)
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleNewTransactionSubmit = (e) => {
        e.preventDefault()

        const formattedDate = new Date(formData.date).toISOString().split("T")[0]

        const newTransaction = {
            senderAccountId: formData.senderAccountId,
            receiverAccountId: formData.receiverAccountId,
            date: formattedDate,
            time: formData.time,
            amount: parseFloat(formData.amount),
            comment: formData.comment    
        }

        fetch('/api/transactions/new', {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(newTransaction)
        })
        .then(res => {
            setShowForm(false)
            setFormData({        
                senderAccountId:'',
                receiverAccountId:'',
                date:'',
                time:'',
                amount:'',
                comment:'' });
            alert('New transaction scheduled') 
        })
        .catch (error => {
            console.error("Error scheduling transaction:", error);
            alert("An error occurred. Please try again later.");
        })
    }

    const toggleDeleteMode = () => {
        setDeleteMode((prevMode) => !prevMode)
        setSelectedTransactions([])
    }

    const handleCheckboxChange = (transactionId) => {
        setSelectedTransactions((prevSelected) => 
            prevSelected.includes(transactionId) ?
                prevSelected.filter((id) => id !== transactionId)
                : [...prevSelected, transactionId] 
    )}

    const handleDeleteSelected = () => {
        setDeleteMode(false)
        alert('Selected transactions deleted')
    }


    return (
        <div className='manage-transactions'>
            <h1>My Transactions</h1>

            <div className="button-container">
                <button className="create-button" onClick={handleCreateTransaction}>
                    New Transactions
                </button>
                <button className="delete-button" onClick={toggleDeleteMode}>
                    {deleteMode? 'Cancel Delete' : 'Delete Transaction'}
                </button>
            </div>

            {showForm && (
                <div className="popup-newtransaction-form">
                    <h2> Schedule New Transaction </h2>
                    <form onSubmit={handleNewTransactionSubmit}>
                        <div>
                            <label>
                                Account ID:
                                <select name="senderAccountId" value={formData.senderAccountId} onChange={handleFormChange}>
                                    {accountIds.map((id) => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>Receiving Account ID:</label>
                            <input type="number" name="receiverAccountId" value={formData.receiverAccountId} onChange={handleFormChange} required/>
                        </div>
                        <div>
                            <label>Date:</label>
                            <input type="date" name="date" value={formData.date} onChange={handleFormChange} required/>
                        </div>
                        <div>
                            <label>Time:</label>
                            <input type="time" name="time" value={formData.time} onChange={handleFormChange} required/>
                        </div>
                        <div>
                            <label>Amount:</label>
                            <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} required/>
                        </div>
                        <div>
                            <label>Comment:</label>
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
                                <td>{t.date}</td>
                                <td>{t.amount}</td>
                                {deleteMode && (
                                    <td>
                                        <input type="checkbox" checked={selectedTransactions.includes(t.id)} onChange={() => handleCheckboxChange(t.id)} />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transactions scheduled.</p>
            )}

            { deleteMode && selectedTransactions.length > 0 && (
            <button className="confirm-delete-buttton" onClick={handleDeleteSelected}>
                Confirm Delete
            </button>
                
        )}
        
        </div>
  
    )

}

export default ManageTransactions