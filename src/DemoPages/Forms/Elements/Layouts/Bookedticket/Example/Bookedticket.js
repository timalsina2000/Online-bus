import React, { Component } from 'react';
import { Container, Card, CardBody, CardTitle, Row, Col } from 'reactstrap';
import { db } from '../../../../../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Allpost.css'; // Use the same CSS or add new styles as needed

export default class AllBookedTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedTickets: [],
      totalPrice: 0, // Ensure this is initialized as a number
    };
  }

  async componentDidMount() {
    try {
      const querySnapshot = await getDocs(collection(db, "bus"));
      const buses = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Extract booked seats from all buses
      const bookedTickets = buses.flatMap(bus =>
        bus.bookedSeats.map(seat => ({
          busName: bus.title,
          busNo: bus.busNo,
          place: bus.parent,
          seatNumber: seat.seat,
          userName: seat.userName,
          userPhone: seat.userPhone,
          seatPrice: bus.seatPrice ? Number(bus.seatPrice) : 0, // Ensure seatPrice is treated as a number
        }))
      );

      // Sum up all the seat prices, making sure to handle undefined prices
      const totalPrice = bookedTickets.reduce(
        (sum, ticket) => sum + (ticket.seatPrice || 0),
        0
      );

      this.setState({ bookedTickets, totalPrice });
    } catch (error) {
      console.error('Error fetching booked tickets: ', error);
      toast.error('Error fetching booked tickets', {
        position: "top-center",
      });
    }
  }

  render() {
    const { bookedTickets, totalPrice } = this.state;

    return (
      <Container fluid>
        <Card className="posts-card">
          <CardBody className='card-body'>
            <CardTitle className='all-post'>All Booked Tickets</CardTitle>

            {/* Display Total Price at the Top */}
            <h5>Total Price of All Booked Tickets: ${Number(totalPrice).toFixed(2)}</h5> {/* Ensure totalPrice is treated as a number */}

            {bookedTickets.length > 0 ? (
              <Row>
                {bookedTickets.map((ticket, index) => (
                  <Col sm="12" md="6" lg="4" key={index}>
                    <Card className="post-item">
                      <CardBody>
                        <h5 className="post-title">Bus Name: {ticket.busName}</h5>
                        <p className="post-content">Bus Number: {ticket.busNo}</p>
                        <p className="post-content">Place: {ticket.place}</p>
                        <p className="post-content">Seat Number: {ticket.seatNumber}</p>
                        <p className="post-content">Price: ${Number(ticket.seatPrice).toFixed(2)}</p> {/* Display seat price */}
                        <p className="post-content">Booked By: {ticket.userName}</p>
                        <p className="post-content">Phone: {ticket.userPhone}</p>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>No booked tickets available</p>
            )}
          </CardBody>
        </Card>
      </Container>
    );
  }
}
