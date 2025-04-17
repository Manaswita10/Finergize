import React from 'react';

interface TransactionProps {
  transaction: {
    id: string;
    type: 'send' | 'receive' | 'deposit' | 'withdraw';
    amount: number;
    with: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'failed';
    recipientAddress?: string;
    senderAddress?: string;
  };
}

const TransactionReceipt: React.FC<TransactionProps> = ({ transaction }) => {
  return (
    <div data-receipt style={{
      width: '600px',
      padding: '40px',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      color: '#000000'
    }}>
      <div style={{
        borderBottom: '2px solid #000000',
        marginBottom: '20px',
        paddingBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>Finergise</h1>
        <p style={{ margin: '0', color: '#666666' }}>Transaction Receipt</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px 0', color: '#666666' }}>Transaction ID:</td>
            <td style={{ padding: '8px 0', textAlign: 'right' }}>{transaction.id}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#666666' }}>Type:</td>
            <td style={{ padding: '8px 0', textAlign: 'right' }}>{transaction.type.toUpperCase()}</td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#666666' }}>Amount:</td>
            <td style={{ padding: '8px 0', textAlign: 'right' }}>
              {transaction.type === 'receive' ? '+' : '-'}₹{transaction.amount}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#666666' }}>Date & Time:</td>
            <td style={{ padding: '8px 0', textAlign: 'right' }}>
              {new Date(transaction.timestamp).toLocaleString()}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#666666' }}>Status:</td>
            <td style={{ padding: '8px 0', textAlign: 'right' }}>
              {transaction.status.toUpperCase()}
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px 0', color: '#666666' }}>
              {transaction.type === 'send' ? 'Recipient' : 'Sender'}:
            </td>
            <td style={{ padding: '8px 0', textAlign: 'right' }}>{transaction.with}</td>
          </tr>
          <tr>
         
            <td style={{ padding: '8px 0', textAlign: 'right', wordBreak: 'break-all' }}>
              {transaction.type === 'send' ? transaction.recipientAddress : transaction.senderAddress}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{
        marginTop: '40px',
        borderTop: '1px solid #CCCCCC',
        paddingTop: '20px',
        textAlign: 'center',
        color: '#666666',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>Thank you for using Finergise</p>
        <p style={{ margin: '0' }}>This is a computer generated receipt</p>
      </div>
    </div>
  );
};

export default TransactionReceipt;