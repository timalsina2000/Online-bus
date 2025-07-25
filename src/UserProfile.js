import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Container, Card, CardBody, CardTitle, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, FormFeedback } from 'reactstrap';
import { db } from './firebase';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Allpost.css';

export default class UserPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buses: [],
      places:[],
      modal: false,
      selectedBus: null,
      selectedSeats: [],
      selectedPlace:'',
      selectedDate:'',
      userName: '',
      userPhone: '',
      selectedPlace: '',
      totalPrice: 0,
      nameError: false,
      phoneError: false,
    };
  }

  async componentDidMount() {
    try {
      const querySnapshot = await getDocs(collection(db, "bus"));
      const buses = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      const places = [...new Set(buses.map(bus => bus.parent))];
      this.setState({ buses, places });
    } catch (error) {
      console.error('Error fetching buses: ', error);
      toast.error('Error fetching buses', {
        position: "top-center",
      });
    }
  }

  toggleModal = (bus) => {
    this.setState({
      modal: !this.state.modal,
      selectedBus: bus,
      selectedSeats: [],
      userName: '',
      userPhone: '',
      totalPrice: 0,
      nameError: false,
      phoneError: false,
    });
  }

  handleSeatClick = (seatNumber) => {
    const { selectedSeats, selectedBus } = this.state;
    const isBooked = selectedBus.bookedSeats.some(seat => seat.seat === seatNumber);
    if (isBooked) {
      toast.error('This seat is already booked', { position: 'top-center' });
      return;
    }
    this.setState(prevState => {
      const isSelected = prevState.selectedSeats.includes(seatNumber);
      const updatedSeats = isSelected
        ? prevState.selectedSeats.filter(seat => seat !== seatNumber)
        : [...prevState.selectedSeats, seatNumber];
      const totalPrice = updatedSeats.length * selectedBus.seatPrice;
      return { selectedSeats: updatedSeats, totalPrice };
    });
  }
   
  handleSubmit = async () => {
    const { selectedBus, selectedSeats, userName, userPhone } = this.state;

    if (!userName.trim() || !userPhone.trim()) {
      this.setState({
        nameError: !userName.trim(),
        phoneError: !userPhone.trim(),
      });
      toast.error('Please enter both your name and phone number.', {
        position: 'top-center',
      });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat.', { position: 'top-center' });
      return;
    }

    this.setState({ nameError: false, phoneError: false });

    // Redirect to Payment
    this.props.history.push({
      pathname: '/payment',
      state: {
        bus: selectedBus,
        seats: selectedSeats,
        name: userName,
        phone: userPhone,
        totalPrice: this.state.totalPrice,
      },
    });
    
    
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handlePlaceFilterChange = (e) => {
    this.setState({ selectedPlace: e.target.value });
  }

  render() {
    const {
      buses, places, modal, selectedBus, selectedSeats,
      selectedPlace, selectedDate, userName, userPhone,
      totalPrice, nameError, phoneError
    } = this.state;

    const filteredBuses = buses.filter(bus => {
      const matchesPlace = selectedPlace ? bus.parent === selectedPlace : true;
      const matchesDate = selectedDate ? bus.departureDate === selectedDate : true;
      return matchesPlace && matchesDate;
    });

    return (
      <Container fluid>
        <TransitionGroup>
          <CSSTransition component="div" classNames="TabsAnimation" appear={true} timeout={0}>
            <div className="posts-container">
              <Card className="posts-card">
                <CardBody>
                  <CardTitle className='all-post'>All Buses</CardTitle>

                  {/* Filter Section */}
                  <FormGroup>
                    <Label for="placeFilter">Filter by Place</Label>
                    <Input
                      type="select"
                      name="placeFilter"
                      id="placeFilter"
                      value={selectedPlace}
                      onChange={this.handleInputChange}
                    >
                      <option value="">All Places</option>
                      {places.map(place => (
                        <option key={place} value={place}>
                          {place}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label for="dateFilter">Filter by Date</Label>
                    <Input
                      type="date"
                      name="selectedDate"
                      id="dateFilter"
                      value={selectedDate}
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>

                  {/* Bus Listing */}
                  {filteredBuses.length > 0 ? (
                    <Row>
                      {filteredBuses.map(bus => (
                        <Col sm="12" md="6" lg="4" key={bus.id}>
                          <Card className="post-item">
                            <CardBody>
                              <h5 className="post-title">Bus Name: {bus.title}</h5>
                              <p className="post-content">Bus Number: {bus.busNo}</p>
                              <p className="post-content">Place: {bus.parent}</p>
                              <p className="post-content">Date: {bus.departureDate}</p>
                              <p className="post-content">Total Seats: {bus.seatCount}</p>
                              <p className="post-content">Available Seats: {bus.seatCount - bus.bookedSeats.length}</p>
                              <p className="post-content">Price per Seat: ${bus.seatPrice}</p>
                              {bus.imageUrl && <img src={bus.imageUrl} alt={bus.title} className="post-image" />}
                              <Button color="info" onClick={() => this.toggleModal(bus)}>Book Ticket</Button>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>No buses available for the selected place or date</p>
                  )}
                </CardBody>
              </Card>
            </div>
          </CSSTransition>
        </TransitionGroup>

        {/* Modal for showing bus details and booking seats */}
        {selectedBus && (
          <Modal isOpen={modal} toggle={() => this.toggleModal(null)}>
            <ModalHeader toggle={() => this.toggleModal(null)}>
              Bus Details
            </ModalHeader>
            <ModalBody>
              <div className="bus-details">
                <h5>Bus Name: {selectedBus.title}</h5>
                <div className="bus-number-container">
                  <div className="bus-number-row">Bus Number:</div>
                  <div className="bus-number-row">{selectedBus.busNo}</div>
                </div>
                <p>Place: {selectedBus.parent}</p>
                <p>Total Seats: {selectedBus.seatCount}</p>
                <p>Available Seats: {selectedBus.seatCount - selectedBus.bookedSeats.length}</p>
                <p>Price per Seat: ${selectedBus.seatPrice}</p>
                <p>Total Price: ${totalPrice}</p>
                {selectedBus.imageUrl && <img src={selectedBus.imageUrl} alt={selectedBus.title} className="post-image" />}
                
                <Row>
                  {Array.from({ length: selectedBus.seatCount }, (_, index) => index + 1).map(seatNumber => {
                    const isBooked = selectedBus.bookedSeats.some(seat => seat.seat === seatNumber);
                    return (
                      <Col key={seatNumber} sm="2" className="seat-col">
                        <Button
                          className={`seat-button ${isBooked ? 'booked' : selectedSeats.includes(seatNumber) ? 'selected' : ''}`}
                          onClick={() => !isBooked && this.handleSeatClick(seatNumber)}
                          disabled={isBooked}
                        >
                          {seatNumber}
                        </Button>
                      </Col>
                    );
                  })}
                </Row>

                <FormGroup>
                  <Label for="userName">Name</Label>
                  <Input
                    type="text"
                    name="userName"
                    id="userName"
                    value={userName}
                    onChange={this.handleInputChange}
                    placeholder="Enter your name"
                    invalid={nameError}
                  />
                  <FormFeedback>Name is required.</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="userPhone">Phone Number</Label>
                  <Input
                    type="text"
                    name="userPhone"
                    id="userPhone"
                    value={userPhone}
                    onChange={this.handleInputChange}
                    placeholder="Enter your phone number"
                    invalid={phoneError}
                  />
                  <FormFeedback>Phone number is required.</FormFeedback>
                </FormGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => this.toggleModal(null)}>
                Close
              </Button>
              <Button color="primary" onClick={this.handleSubmit}>
                Book Selected Seats
              </Button>
            </ModalFooter>
          </Modal>
        )}
      </Container>
    );
  }
}
