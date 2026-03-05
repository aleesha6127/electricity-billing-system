import { useState } from 'react';
import { useUser } from '../context/UserContext';
import './Payments.css';

function Payments() {
  const { user, paymentHistory, currentBill, addFunds, payBill } = useUser();
  const [addFundAmount, setAddFundAmount] = useState('');
  const [showAddFundModal, setShowAddFundModal] = useState(false);

  const handleAddFunds = (e) => {
    e.preventDefault();
    const amount = parseFloat(addFundAmount);
    if (amount > 0) {
      addFunds(amount);
      setAddFundAmount('');
      setShowAddFundModal(false);
      alert(`₹${amount.toFixed(2)} added to wallet successfully!`);
    }
  };

  const handlePayBill = () => {
    if (currentBill <= 0) {
      alert('No pending bills to pay.');
      return;
    }
    if (user.walletBalance >= currentBill) {
      if (payBill(currentBill)) {
        alert(`Bill of ₹${currentBill.toFixed(2)} paid successfully!`);
      }
    } else {
      alert(`Insufficient balance. Please add ₹${(currentBill - user.walletBalance).toFixed(2)} to your wallet.`);
    }
  };

  return (
    <div className="payments">
      <div className="payments-header">
        <h1 className="payments-title">User Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card wallet">
          <div className="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <div className="summary-content">
            <p className="summary-label">Wallet Balance</p>
            <p className="summary-value">₹{user.walletBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card bill">
          <div className="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className="summary-content">
            <p className="summary-label">Current Bill</p>
            <p className="summary-value">₹{currentBill.toFixed(2)}</p>
            <p className={`summary-status ${currentBill > 0 ? 'pending' : 'paid'}`}>
              {currentBill > 0 ? 'Pending' : 'Paid'}
            </p>
          </div>
        </div>

        <div className="summary-card total">
          <div className="summary-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="summary-content">
            <p className="summary-label">Total Paid</p>
            <p className="summary-value">₹{user.totalPaid.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Action Sections */}
      <div className="action-sections">
        <div className="action-card">
          <div className="action-content">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <div className="action-text">
              <h3>Add Funds</h3>
              <p>Top up your wallet balance</p>
            </div>
          </div>
          <button className="action-button add" onClick={() => setShowAddFundModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add
          </button>
        </div>

        <div className="action-card">
          <div className="action-content">
            <div className="action-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            </div>
            <div className="action-text">
              <h3>Pay Bill</h3>
              <p>{currentBill > 0 ? `Amount: ₹${currentBill.toFixed(2)}` : 'No pending bills'}</p>
            </div>
          </div>
          <button 
            className={`action-button pay ${currentBill <= 0 ? 'disabled' : ''}`}
            onClick={handlePayBill}
            disabled={currentBill <= 0}
          >
            Pay
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="payment-history-card">
        <div className="history-header">
          <div className="history-title-section">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h2 className="history-title">Payment History</h2>
          </div>
        </div>
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.date}</td>
                  <td className="amount-cell">₹{payment.amount.toFixed(2)}</td>
                  <td>{payment.method}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Fund Modal */}
      {showAddFundModal && (
        <div className="modal-overlay" onClick={() => setShowAddFundModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Funds to Wallet</h3>
              <button className="modal-close" onClick={() => setShowAddFundModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddFunds} className="modal-form">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={addFundAmount}
                  onChange={(e) => setAddFundAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowAddFundModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;

