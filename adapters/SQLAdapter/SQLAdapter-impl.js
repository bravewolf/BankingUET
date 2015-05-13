/************************************************************************
 * Implementation code for procedure - 'procedure1'
 *
 *
 * @return - invocationResult
 */
 
var GetAccountsStatement = WL.Server.createSQLStatement("select AccountID from Accounts where CustomerId = ?");
function GetAccounts(CustomerId) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : GetAccountsStatement,
		parameters : [CustomerId]
	});
}
var GetAccountsInfoStatement = WL.Server.createSQLStatement("select AccountType, AccountBalance from Accounts where AccountId = ?");
function GetAccountInfo(AccountId) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : GetAccountsInfoStatement,
		parameters : [AccountId]
	});
}
var GetBalanceStatement = WL.Server.createSQLStatement("SELECT AccountBalance FROM Accounts WHERE AccountId = ?");
function  GetBalance(AccountId) {
	return WL.Server.invokeSQLStatement({
		preparedStatement :  GetBalanceStatement,
		parameters : [AccountId]
	});
}

var GetTransactionListStatement = WL.Server.createSQLStatement("select * from AccountTransactions where fromAccount = ? or toAccount = ? ORDER BY TransactionDate DESC");
function GetTransactionList(fromAccount, toAccount) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : GetTransactionListStatement,
		parameters : [fromAccount,toAccount]
	});
}

var CreateTransactionStatement = WL.Server.createSQLStatement("INSERT INTO AccountTransactions (transactionId,fromAccount,toAccount,transactionAmount, transactionDate,transactionType) values (?,?,?,?,?,?)");
function CreateTransaction(transactionId,fromAccount,toAccount,transactionAmount, transactionDate,transactionType) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : CreateTransactionStatement,
		parameters : [transactionId,fromAccount,toAccount,transactionAmount, transactionDate,transactionType]
	});
}

var UpdateBalanceStatement = WL.Server.createSQLStatement("UPDATE Accounts SET accountBalance = ? WHERE accountId = ?");
function  UpdateBalance(accountBalance, accountId) {
	return WL.Server.invokeSQLStatement({
		preparedStatement :  UpdateBalanceStatement,
		parameters : [accountBalance, accountId]
	});
}



var CreateAccountStatement = WL.Server.createSQLStatement("INSERT INTO Accounts (customerId,accountId,accountBalance,accountType) values (?,?,?,?)");
function CreateAccount(customerId,accountId,accountBalance,accountType) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : CreateAccountStatement,
		parameters : [customerId,accountId,accountBalance,accountType]
	});
}

var DeleteAccountStatement = WL.Server.createSQLStatement("DELETE FROM Accounts WHERE AccountId = ?");
function  DeleteAccount(AccountId) {
	return WL.Server.invokeSQLStatement({
		preparedStatement :  DeleteAccountStatement,
		parameters : [AccountId]
	});
}