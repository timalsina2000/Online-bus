import React, { Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  Col,
  Card,
  CardBody,
  CardTitle,
  Container,
  Table,
  Button,
} from "reactstrap";
import { db } from "../../../../../../firebase"; 
import { collection, getDocs } from 'firebase/firestore';


export default class AllCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
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

  slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')         // Replace spaces with -
      .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
      .replace(/\-\-+/g, '-');      // Replace multiple - with single -
  }



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
                  <CardTitle>All Tickets</CardTitle>
                  <Table striped>
                    <thead>
                      <tr>
                        <th>S.N</th>
                        <th>place</th>
                        <th>Slug</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.categories.map((category, index) => (
                        <tr key={category.id}>
                          <th scope="row">{index + 1}</th>
                          <td>{category.name}</td>
                          <td>{this.slugify(category.slug)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {/* <Button color="primary" onClick={() => alert("New Category Clicked")}>
                    Add New Category
                  </Button> */}
                </CardBody>
              </Card>
            </Container>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}












