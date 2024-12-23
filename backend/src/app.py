import os
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import datetime

x = datetime.datetime.now()

basedir = os.path.abspath(os.path.dirname(__file__))

# Initisalising flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class BankAccount(db.Model):
    __tablename__='BankAccount'

    AccountID = db.Column(db.Integer, primary_key=True, nullable=False)
    UserID = db.Column(db.Integer, primary_key=True ,nullable=False)
    AccountType = db.Column(db.String(255))
    AccountBalance = db.Column(db.Numeric(10,2))

    # def __repr__(self):
    #     return f'<Account {self.AccountID}'


class ScheduledTransactions(db.Model):
    __tablename__='ScheduledTransactions'

    TransactionID = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    AccountID = db.Column(db.Integer, nullable=False)
    ReceivingAccountID = db.Column(db.Integer)
    Date = db.Column(db.String(255))
    TransactionAmount = db.Column(db.Numeric(10,2))
    Comment = db.Column(db.String(255))

    # def __repr__(self):
    #     return f'<Transaction {self.TransactionID}'
    

class User(db.Model):
    __tablename__='User'

    UserID = db.Column(db.Integer, primary_key=True, nullable=False)
    Username = db.Column(db.String(20))
    Password = db.Column(db.String(20))
    Firstname = db.Column(db.String(255))
    Lastname = db.Column(db.String(255))
    Email = db.Column(db.String(255))
    Address = db.Column(db.String(255))
    OptIntoPhyStatements = db.Column(db.Boolean)

    # def __repr__(self):
    #     return f'<User {self.UserID}'

# Route for seeing a data
@app.route('/data')
def get_time():

    # Return api to show in reactjs
    return {
        'Name':'geek',
        'Age':'22', 
        'Date':x,
        'Programming':'python'
    }

@app.route('/api/accounts')
def get_accounts():
    accounts = BankAccount.query.all()
    account_list = [{'AccountID': a.AccountID, 'AccountBalance': a.AccountBalance} for a in accounts]
    print(account_list)
    return jsonify(account_list)

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    existing_user = User.query.filter_by(Username=username).first()
    if not existing_user or existing_user.Password != password:
        return jsonify({'message': 'Invalid email or password'}), 401

    # Respond with user info and token
    return jsonify({
        'data': {
            'user': {
                'id': existing_user.UserID,
                'username': existing_user.Username
            }
        },
        'token': existing_user.UserID
    }), 200


@app.route('/api/accounts/dashboard', methods=['GET'])
def get_user_accounts():
    # Extract userid (token) from request headers
    user_id = request.headers.get('userid')
    
    if not user_id:
        return jsonify({"error": "Missing userid in headers"}), 400

    # Retrieve account data for the given user_id (token)
    accounts = BankAccount.query.filter_by(UserID=user_id).all()
    account_list = [{'AccountID': a.AccountID, 'AccountBalance': float(a.AccountBalance)} for a in accounts]
    
    # Respond with account data
    return jsonify(account_list), 200

@app.route('/api/transactions/dashboard', methods=['POST'])
def get_transactions_by_account_ids():
    account_ids = request.json.get('account_ids', [])
    if not account_ids:
        return jsonify({'error': 'No account IDs provided'}), 400
    
    transactions = ScheduledTransactions.query.filter(
        ScheduledTransactions.AccountID.in_(account_ids)
    ).all()

    transaction_list = [
        {
            "TransactionID": t.TransactionID,
            "AccountID": t.AccountID,
            "ReceivingAccountID": t.ReceivingAccountID,
            "Date": t.Date,
            "TransactionAmount": float(t.TransactionAmount),
            "Comment": t.Comment,
        }
        for t in transactions
    ]
    
    return jsonify(transaction_list), 200

@app.route('/api/transactions/new', methods=['PUT'])
def schedule_new_transaction():
    try:
        data = request.get_json()

        sender_account_id = data.get('senderAccountId')
        receiver_account_id = data.get('receiverAccountId')
        date = data.get('date')
        time = data.get('time')  
        amount = data.get('amount')
        comment = data.get('comment')

        new_transaction = ScheduledTransactions(
            AccountID=sender_account_id,
            ReceivingAccountID=receiver_account_id,
            Date=date.split("T")[0],
            TransactionAmount=amount,
            Comment=comment)
        
        db.session.add(new_transaction)
        db.session.commit()

        transactions = ScheduledTransactions.query.all()
        print(transactions)

        db.session.close()

        return jsonify({"message": "Transaction scheduled successfully!"}), 200
   
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Failed to schedule transaction", "error": str(e)}), 500


@app.route('/api/transactions/delete', methods=['POST'])
def delete_transactions_by_id():
    try:
        data = request.get_json()
        transaction_ids = data.get('transactionsIds')

        ScheduledTransactions.query.filter(ScheduledTransactions.TransactionID.in_(transaction_ids)).delete(synchronize_session=False)

        db.session.commit()
        return jsonify({'message': "Transactions deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        db.session.close()

@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    user = db.session.get(User, user_id)

    if user:
        return jsonify({
            'Username': user.Username,
            'Firstname': user.Firstname,
            'Lastname': user.Lastname,
            'Email': user.Email,
            'Address': user.Address,
            'OptIntoPhyStatements': user.OptIntoPhyStatements
        }), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/user/<int:user_id>', methods=['POST'])
def update_user_details():
    return 


# Run app
if __name__ == '__main__':
    app.run(debug=True)