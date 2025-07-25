// PaymentSuccess.js
import React, { useEffect } from 'react';
import { useHistory ,useLocation} from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const PaymentSuccess = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("pid");

  useEffect(() => {
    const confirmBooking = async () => {
      const paymentState = JSON.parse(sessionStorage.getItem('paymentState'));

      if (!paymentState) {
        toast.error('Invalid payment state. Redirecting to home.');
        return history.push('/');
      }

      const { bus, seats, name, phone, transactionUUID } = paymentState;

      try {
        // Update Firestore
        const docRef = doc(db, 'bus', bus.id);
        const newBookedSeats = [
          ...bus.bookedSeats,
          ...seats.map(seat => ({ seat, userName: name, userPhone: phone })),
        ];
        const newSeatCount = bus.seatCount - seats.length;

        await updateDoc(docRef, {
          bookedSeats: newBookedSeats,
          seatCount: newSeatCount,
        });

        toast.success('Payment successful! Booking confirmed.');
        history.push({
          pathname: '/ticket',
          state: { transactionUUID },
        });
      } catch (error) {
        console.error('Error updating booking: ', error);
        toast.error('Failed to confirm booking. Please contact support.');
        history.push('/');
      }
    };

    confirmBooking();
  }, [history]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h3>Payment Successful!</h3>
      <p>Redirecting to your ticket...</p>
      <p>Payment ID: {paymentId}</p>
    </div>
  );
};

export default PaymentSuccess;
