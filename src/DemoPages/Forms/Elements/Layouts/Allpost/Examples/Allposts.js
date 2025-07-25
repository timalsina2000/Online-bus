import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Container, Card, CardBody, CardTitle, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import { db } from '../../../../../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'; // Added deleteDoc
import { toast } from 'react-toastify';
import './Allpost.css'; // Import the CSS file

export default class AllPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buses: [],
      modal: false,
      selectedBus: null,
      selectedSeats: [],
      userName: '',
      userPhone: '',
      places: [], // List of all unique places for filtering
      selectedPlace: '', // Currently selected place for filtering
      totalPrice: 0, // Track total price of selected seats
    };
  }

  async componentDidMount() {
    try {
      const querySnapshot = await getDocs(collection(db, "bus"));
      const buses = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Get a unique list of places from the buses data for filtering
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
      selectedSeats: [], // Reset selected seats when opening the modal
      userName: '',
      userPhone: '',
      totalPrice: 0, // Reset total price when modal opens
    });
  }

  handleSeatClick = (seatNumber) => {
    const { selectedSeats, selectedBus } = this.state;

    // Check if seat is already booked
    const isBooked = selectedBus.bookedSeats.some(seat => seat.seat === seatNumber);
    if (isBooked) {
      toast.error('This seat is already booked', { position: 'top-center' });
      return;
    }

    // Toggle seat selection and update the total price
    this.setState(prevState => {
      const isSelected = prevState.selectedSeats.includes(seatNumber);
      const updatedSeats = isSelected
        ? prevState.selectedSeats.filter(seat => seat !== seatNumber)
        : [...prevState.selectedSeats, seatNumber];

      // Update the total price based on seat selection
      const totalPrice = updatedSeats.length * selectedBus.seatPrice;

      return { selectedSeats: updatedSeats, totalPrice };
    });
  }

  handleSubmit = async () => {
    const { selectedBus, selectedSeats, userName, userPhone } = this.state;

    if (!userName.trim() || !userPhone.trim()) {
      toast.error('Please enter both your name and phone number.', {
        position: 'top-center',
      });
      return; // Stop submission if validation fails
    }

    try {
      const docRef = doc(db, "bus", selectedBus.id);

      // Calculate new available seat count after booking
      const newBookedSeats = [
        ...selectedBus.bookedSeats,
        ...selectedSeats.map(seat => ({ seat, userName, userPhone }))
      ];

      const newSeatCount = selectedBus.seatCount - selectedSeats.length;

      // Update Firestore with the new seat count and booked seats
      await updateDoc(docRef, {
        bookedSeats: newBookedSeats,
        seatCount: newSeatCount, // Update seat count to reflect remaining available seats
      });

      toast.success('Seats booked successfully', {
        position: "top-center",
      });

      // Update state locally for UI update
      this.setState((prevState) => ({
        buses: prevState.buses.map(bus =>
          bus.id === selectedBus.id
            ? { ...bus, bookedSeats: newBookedSeats, seatCount: newSeatCount }
            : bus
        ),
        modal: false, // Close the modal after booking
        selectedBus: null,
        selectedSeats: [],
        totalPrice: 0,
      }));
    } catch (error) {
      console.error('Error booking seats: ', error);
      toast.error('Error booking seats', {
        position: "top-center",
      });
    }
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handlePlaceFilterChange = (e) => {
    this.setState({ selectedPlace: e.target.value });
  }

  deleteBus = async (busId) => {
    try {
      await deleteDoc(doc(db, "bus", busId));
      this.setState(prevState => ({
        buses: prevState.buses.filter(bus => bus.id !== busId)
      }));
      toast.success('Bus deleted successfully', {
        position: "top-center",
      });
    } catch (error) {
      console.error('Error deleting bus: ', error);
      toast.error('Error deleting bus', {
        position: "top-center",
      });
    }
  }

  render() {
    const { buses, modal, selectedBus, selectedSeats, userName, userPhone, places, selectedPlace, totalPrice } = this.state;

    // Filter buses by selected place
    const filteredBuses = selectedPlace
      ? buses.filter(bus => bus.parent === selectedPlace)
      : buses;

    return (
      <Container fluid>
        <TransitionGroup>
          <CSSTransition
            component="div"
            classNames="TabsAnimation"
            appear={true}
            timeout={0}
            enter={false}
            exit={false}
          >
            <div className="posts-container">
              <Card className="posts-card">
                <CardBody className='card-body'>
                  <CardTitle className='all-post'>All Buses</CardTitle>
                  
                  {/* Filter by Place */}
                  <FormGroup>
                    <Label for="placeFilter">Filter by Place</Label>
                    <Input
                      type="select"
                      name="placeFilter"
                      id="placeFilter"
                      value={selectedPlace}
                      onChange={this.handlePlaceFilterChange}
                    >
                      <option value="">All Places</option>
                      {places.map(place => (
                        <option key={place} value={place}>
                          {place}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>

                  {filteredBuses.length > 0 ? (
                    <Row>
                      {filteredBuses.map(bus => (
                        <Col sm="12" md="6" lg="4" key={bus.id}>
                          <Card className="post-item">
                            <CardBody>
                              <h5 className="post-title">Bus Name: {bus.title}</h5>
                              <p className="post-content">Bus Number: {bus.busNo}</p>
                              <p className="post-content">Place: {bus.parent}</p>
                              <p className="post-content">Total Seats: {bus.seatCount}</p>
                              <p className="post-content">Available Seats: {bus.seatCount - bus.bookedSeats.length}</p>
                              <p className="post-content">Price per Seat: ${bus.seatPrice}</p> {/* Display seat price */}
                              {bus.imageUrl && <img src={bus.imageUrl} alt={bus.title} className="post-image" />}
                              <Button 
                                color="info" 
                                className="view-button" 
                                onClick={() => this.toggleModal(bus)}
                              >
                                Book Ticket
                              </Button>
                              <Button 
                                color="danger" 
                                className="delete-button" 
                                onClick={() => this.deleteBus(bus.id)}
                              >
                                Delete Bus
                              </Button>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>No buses available for the selected place</p>
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
                <p>Price per Seat: ${selectedBus.seatPrice}</p> {/* Display seat price */}
                <p>Total Price: ${totalPrice}</p> {/* Display total price */}
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
                  />
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
                  />
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
