import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import './Ticket.css'

const Ticket = () => {
  const location = useLocation();
  const { transactionUUID } = location.state || {};

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Ticket Details', 10, 10);
    doc.text(`Transaction ID: ${transactionUUID}`, 10, 20);
    doc.text('Thank you for booking!', 10, 30);
    doc.save(`Ticket-${transactionUUID}.pdf`);
  };

  return (
    <div>
      <h2>Your Ticket</h2>
      <p>Transaction ID: {transactionUUID}</p>
      <button onClick={generatePDF}>Download Ticket as PDF</button>
    </div>
  );
};

export default Ticket;
