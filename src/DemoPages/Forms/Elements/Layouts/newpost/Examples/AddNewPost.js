import React, { Fragment } from "react"; 
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
} from "reactstrap";
import { db, storage } from "../../../../../../firebase";

import { collection, getDocs } from 'firebase/firestore';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default class AddNewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      busNo: '',
      seatCount: 0,
      seatPrice: 0,  // Added seatPrice to state
      slug: '',
      image: null,
      parent: '',
      categories: [],
      departureDate: '',
    };
  }

  async componentDidMount() {
    try {
      const querySnapshot = await getDocs(collection(db, "places"));
      const categories = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      this.setState({ categories });
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onFileSelect = (file) => {
    if (file && file.size > 200000) {
      toast.error('Size is greater than 2MB', {
        position: "top-center",
      });
      return null;
    }
    return file;
  }

  handleFileChange = (e) => {
    const file = this.onFileSelect(e.target.files[0]);
    if (file) {
      this.setState({ image: file });
    } else {
      this.setState({ image: null });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { title, busNo, departureDate, seatCount, seatPrice, slug, parent, image } = this.state;

    try {
      let imageUrl = '';

      // Upload the image if selected
      if (image) {
        const imageRef = ref(storage, 'posts/' + image?.name);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const categoryDoc = doc(db, "bus", slug);
      await setDoc(categoryDoc, {
        title,
        busNo,
        seatCount,
        seatPrice,  // Saving seat price
        slug,
        parent,
        imageUrl,
        departureDate,
        bookedSeats: [], // Initialize with empty array
        seats: Array.from({ length: seatCount }, (_, i) => i + 1),
      });

      toast.success('Bus added successfully', {
        position: "top-center",
      });
    } catch (error) {
      console.error('There was an error adding the bus!', error);
      toast.error('Error adding bus', {
        position: "top-center",
      });
    }
  };

  render() {
    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition
            component="div"
            classNames="TabsAnimation"
            appear={true}
            timeout={0}
            enter={false}
            exit={false}
          >
            <Container fluid>
              <Card className="main-card mb-3">
                <CardBody>
                  <CardTitle>Add New Bus</CardTitle>
                  <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                      <Label for="postTitle">Bus Name</Label>
                      <Input
                        type="text"
                        name="title"
                        id="postTitle"
                        placeholder="Bus Name"
                        value={this.state.title}
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="busNo">Bus Number</Label>
                      <Input
                        type="text"
                        name="busNo"
                        id="busNo"
                        placeholder="Bus Number"
                        value={this.state.busNo}
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="seatCount">Number of Seats</Label>
                      <Input
                        type="number"
                        name="seatCount"
                        id="seatCount"
                        placeholder="Number of seats on the bus"
                        value={this.state.seatCount}
                        onChange={this.handleInputChange}
                        min="1"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="seatPrice">Seat Price</Label>
                      <Input
                        type="number"
                        name="seatPrice"
                        id="seatPrice"
                        placeholder="Price per seat"
                        value={this.state.seatPrice}
                        onChange={this.handleInputChange}
                        min="0"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="departureDate">Departure Date</Label>
                      <Input
                        type="date"
                        name="departureDate"
                        id="departureDate"
                        placeholder="Departure Date"
                        value={this.state.departureDate}
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup row>
                      <Label for="parent" sm={2}>Choose Place</Label>
                      <Col sm={10}>
                        <Input
                          type="select"
                          name="parent"
                          id="parent"
                          value={this.state.parent}
                          onChange={this.handleInputChange}
                        >
                          <option value="">None</option>
                          {this.state.categories.map(category => (
                            <option key={category.id} value={category.slug}>
                              {category.name}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label for="postSlug">Slug</Label>
                      <Input
                        type="text"
                        name="slug"
                        id="postSlug"
                        placeholder="Slug"
                        value={this.state.slug}
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                    <FormGroup row>
                      <Label for="featuredImage" sm={2}>Choose Image of Bus</Label>
                      <Col sm={10}>
                        <Input
                          type="file"
                          name="image"
                          id="featuredImage"
                          onChange={this.handleFileChange}
                        />
                      </Col>
                    </FormGroup>
                    <Button color="primary" type="submit">Submit</Button>
                  </Form>
                </CardBody>
              </Card>
            </Container>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}
