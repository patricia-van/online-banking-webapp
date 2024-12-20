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

# Run app
if __name__ == '__main__':
    app.run(debug=True)