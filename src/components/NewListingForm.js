import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { BACKEND_URL } from "../constants";

const NewListingForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [shippingDetails, setShippingDetails] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } =
    useAuth0();

  const checkUser = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      const accessToken = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope:
          "read:current_user update:current_user_metadata openid profile email",
      });

      setToken(accessToken);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  const handleChange = (event) => {
    switch (event.target.name) {
      case "title":
        setTitle(event.target.value);
        break;
      case "category":
        setCategory(event.target.value);
        break;
      case "condition":
        setCondition(event.target.value);
        break;
      case "price":
        setPrice(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "shippingDetails":
        setShippingDetails(event.target.value);
        break;
      default:
    }
  };

  const handleSubmit = async (event) => {
    // Prevent default form redirect on submission
    event.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_URL}/listings`,
        {
          title,
          category,
          condition,
          price,
          description,
          shippingDetails,
          sellerEmail: user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setCategory("");
      setCondition("");
      setPrice(0);
      setDescription("");
      setShippingDetails("");

      // Navigate to listing-specific page after submitting form
      navigate(`/listings/${res.data.id}`);
    } catch (error) {
      // Handle the error here
      console.error("Error submitting form:", error.message, error.code);
    }
  };

  // Send request to create new listing in backend

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="iPhone 13, like new!"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={category}
            onChange={handleChange}
            placeholder="Electronics"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Condition</Form.Label>
          <Form.Control
            type="text"
            name="condition"
            value={condition}
            onChange={handleChange}
            placeholder="Like New"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price ($)</Form.Label>
          <Form.Control
            type="text"
            name="price"
            value={price}
            onChange={handleChange}
            placeholder="999"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Bought 2 months ago, selling because switching to Android."
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Shipping Details</Form.Label>
          <Form.Control
            as="textarea"
            name="shippingDetails"
            value={shippingDetails}
            onChange={handleChange}
            placeholder="Same day shipping, we can message to coordinate!"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          List this item
        </Button>
      </Form>
    </div>
  );
};

export default NewListingForm;
