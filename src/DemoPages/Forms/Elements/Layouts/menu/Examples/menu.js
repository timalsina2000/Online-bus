import React, { Fragment } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  ListGroup,
  ListGroupItem,
  Collapse,
  Row,
  Col,
} from "reactstrap";
import { db } from "../../../../../../firebase";
 // Adjust the import path as needed
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default class MenuEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      editingCategory: null,
      isOpen: false,
    };
  }

  async componentDidMount() {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categories = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      this.setState({ categories });
    } catch (error) {
      console.error("Error fetching categories: ", error);
    }
  }

  toggleCollapse = (category) => {
    this.setState({
      editingCategory: category,
      isOpen: category.id === this.state.editingCategory?.id ? !this.state.isOpen : true,
    });
  };

  handleCategoryChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      editingCategory: {
        ...prevState.editingCategory,
        [name]: value,
      }
    }));
  };

  saveCategory = async () => {
    const { editingCategory } = this.state;
    try {
      await setDoc(doc(db, "categories", editingCategory.id), editingCategory);
      toast.success("Category updated successfully", {
        position: "top-center",
      });
      this.setState({ isOpen: false, editingCategory: null });
    } catch (error) {
      console.error("There was an error updating the category!", error);
      toast.error("Error updating category", {
        position: "top-center",
      });
    }
  };

  deleteCategory = async () => {
    const { editingCategory } = this.state;
    try {
      await deleteDoc(doc(db, "categories", editingCategory.id));
      toast.success("Category deleted successfully", {
        position: "top-center",
      });
      this.setState(prevState => ({
        categories: prevState.categories.filter(category => category.id !== editingCategory.id),
        isOpen: false,
        editingCategory: null,
      }));
    } catch (error) {
      console.error("There was an error deleting the category!", error);
      toast.error("Error deleting category", {
        position: "top-center",
      });
    }
  };

  render() {
    const { categories, editingCategory, isOpen } = this.state;

    return (
      <Fragment>
        <Container fluid>
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle>Bottom Menu</CardTitle>
              <ListGroup>
                {categories.map(category => (
                  <ListGroupItem
                    key={category.id}
                    onClick={() => this.toggleCollapse(category)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {category.name}
                    <span className="badge badge-primary badge-pill">Category</span>
                  </ListGroupItem>
                ))}
              </ListGroup>
              <div style={{border:'1px solid lightgray',marginTop:'10px',borderRadius:'20px',padding:'10px'}}>
              <Collapse isOpen={isOpen}>
                {editingCategory && (
                  <Form>
                    <FormGroup>
                      <Label for="navLabel">Categories</Label>
                      <Input
                        type="text"
                        name="name"
                        id="navLabel"
                        placeholder="Navigation Label"
                        value={editingCategory.name}
                        onChange={this.handleCategoryChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="titleAttr">Title Attribute</Label>
                      <Input
                        type="text"
                        name="titleAttribute"
                        id="titleAttr"
                        placeholder="Title Attribute"
                        value={editingCategory.titleAttribute || ''}
                        onChange={this.handleCategoryChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="cssClasses">CSS Classes</Label>
                      <Input
                        type="text"
                        name="cssClasses"
                        id="cssClasses"
                        placeholder="CSS Classes"
                        value={editingCategory.cssClasses || ''}
                        onChange={this.handleCategoryChange}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        placeholder="Description"
                        value={editingCategory.description || ''}
                        onChange={this.handleCategoryChange}
                      />
                    </FormGroup>
                    <Button color="primary" onClick={this.saveCategory}>Save</Button>
                    <Button color="danger" onClick={this.deleteCategory} className="ml-2">Delete</Button>
                  </Form>
                )}
              </Collapse>
              </div>
              <Button color="primary" className="mt-3" onClick={() => toast.info("siddhartha is working on it")}>click me</Button>
            </CardBody>
          </Card>
        </Container>
      </Fragment>
    );
  }
}
