// PaymentFailure.js
import React from 'react';
import { useHistory } from 'react-router-dom';

const PaymentFailure = () => {
  const history = useHistory();

  const handleRetry = () => {
    const paymentState = JSON.parse(sessionStorage.getItem('paymentState'));
    if (paymentState) {
      history.push('/payment', paymentState);
    } else {
      history.push('/');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h3>Payment Failed!</h3>
      <p>Something went wrong with the payment. Please try again.</p>
      <button onClick={handleRetry} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Retry Payment
      </button>
    </div>
  );
};

export default PaymentFailure;
