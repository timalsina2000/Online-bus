import React, { useState } from "react";
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
  FormText,
  Container,
} from "reactstrap";
import { db } from "../../../../../../firebase";
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';


const AddCategory = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const categoryDoc = doc(db, "places", slug);
      await setDoc(categoryDoc, {
        name,
        slug,
        description,
      });
      toast.success("Category added successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error('Error adding category: ', error);
      toast.error("Error adding category", {
        position: "top-center",
      });
    }
  };

  return (
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
              <CardTitle>Add New place</CardTitle>
              <Form onSubmit={handleSubmit}>
                <FormGroup row>
                  <Label for="name" sm={2}>
                    Name
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="place name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <FormText color="muted">
                      add the place for ticket
                    </FormText>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="slug" sm={2}>
                    Slug
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="text"
                      name="slug"
                      id="slug"
                      placeholder="Slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                    <FormText color="muted">
                      The “slug” is the URL-friendly version of the name.
                    </FormText>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="description" sm={2}>
                    Description of place
                  </Label>
                  <Col sm={10}>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <FormText color="muted">
                      The description is not prominent by default; however, some themes may show it.
                    </FormText>
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button type="submit">Add New Category</Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AddCategory;
