// Payment.js
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = () => {
  const location = useLocation();
  const history = useHistory();
  const { bus, seats, name, phone, totalPrice } = location.state;

  useEffect(() => {
    const initiatePayment = async () => {
      const transactionUUID = `bus_ticket_${Date.now()}`;
      const esewaConfig = {
        amt: totalPrice,
        psc: 0,
        pdc: 0,
        txAmt: 0,
        tAmt: totalPrice,
        pid: transactionUUID, // Unique payment ID
        scd: 'EPAYTEST', // Replace with actual eSewa merchant code
        su: '/payment-success',
        //su: `${window.location.origin}/payment-success?pid=${transactionUUID}`, // Success URL
        fu: `${window.location.origin}/payment-failure`, // Failure URL
      };

      // Save transaction details in case of redirection back
      sessionStorage.setItem('paymentState', JSON.stringify({ bus, seats, name, phone, totalPrice, transactionUUID }));

      // Redirect to eSewa
      window.location.href = `https://uat.esewa.com.np/epay/main?amt=${esewaConfig.amt}&pdc=${esewaConfig.pdc}&psc=${esewaConfig.psc}&txAmt=${esewaConfig.txAmt}&tAmt=${esewaConfig.tAmt}&pid=${esewaConfig.pid}&scd=${esewaConfig.scd}&su=${esewaConfig.su}&fu=${esewaConfig.fu}`;
    };

    initiatePayment();
  }, [totalPrice, bus, seats, name, phone, history]);

  return ( 
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h3>Processing Payment...</h3>
      <p>Please wait while we redirect you to eSewa for payment.</p>
    </div>
  );
};

export default Payment;
