import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { db } from '../../../../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './SeatSelection.css'; // Import your CSS file for custom styles

export default class SeatSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bus: null,
      selectedSeats: [],
    };
  }

     

  async componentDidMount() {
    const { slug } = this.props.match.params;
    try {
      const docRef = doc(db, "bus", slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.setState({ bus: docSnap.data() });
      } else {
        toast.error('Bus not found', {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error('Error fetching bus: ', error);
      toast.error('Error fetching bus', {
        position: "top-center",
      });
    }
  }

  handleSeatClick = (seatNumber) => {
    this.setState(prevState => {
      const { selectedSeats } = prevState;
      const isSelected = selectedSeats.includes(seatNumber);

      if (isSelected) {
        return { selectedSeats: selectedSeats.filter(seat => seat !== seatNumber) };
      } else {
        return { selectedSeats: [...selectedSeats, seatNumber] };
      }
    });
  };

  handleSubmit = async () => {
    const { slug } = this.props.match.params;
    const { selectedSeats } = this.state;

    try {
      const docRef = doc(db, "bus", slug);
      await updateDoc(docRef, {
        bookedSeats: selectedSeats,
      });

      toast.success('Seats booked successfully', {
        position: "top-center",
      });
    } catch (error) {
      console.error('Error booking seats: ', error);
      toast.error('Error booking seats', {
        position: "top-center",
      });
    }
  };

  render() {
    const { bus, selectedSeats } = this.state;

    if (!bus) {
      return <Container>Loading...</Container>;
    }

    const seats = Array.from({ length: bus.seatCount }, (_, index) => index + 1);

    return (
      <Container fluid>
        <h3>Bus Name: {bus.title}</h3>
        <p>Bus Number: {bus.busNo}</p>
        <p>Place: {bus.parent}</p>
        <p>Total Seats: {bus.seatCount}</p>
        <p>Available Seats: {bus.seatCount - bus.bookedSeats.length}</p>

        <Row>
          {seats.map(seatNumber => (
            <Col key={seatNumber} sm="2" className="seat-col">
              <Button
                className={`seat-button ${selectedSeats.includes(seatNumber) ? 'selected' : ''}`}
                onClick={() => this.handleSeatClick(seatNumber)}
              >
                {seatNumber}
              </Button>
            </Col>
          ))}
        </Row>

        <Button color="primary" onClick={this.handleSubmit}>Book Selected Seats</Button>
      </Container>
    );
  }
}
