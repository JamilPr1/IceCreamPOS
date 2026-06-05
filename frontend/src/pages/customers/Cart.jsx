import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Box,
} from "@chakra-ui/react";
import "../../styles/IceCream.css";
import { useNavigate } from 'react-router-dom';
import UseToast from '../../customHook/UseToast';
import { Spinner } from '@chakra-ui/react'
import CartCard from '../../components/CardCard';
import { makePayment } from '../../utils/razorpay';
import { API_URL } from '../../config/api';

const Cart = () => {
  const [data, setData] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [total, setTotal] = useState()
  const navigate = useNavigate();
  const toastMsg = UseToast();


  const getData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cart`);
      const res = await response.json();
      if (response.ok) {
        setData(res);
        setLoading(false);
        let sum = 0;
        res.forEach((el) => {
          sum += el.Price * el.Quantity;
        });
        setTotal(sum);
      } else {
        console.log('Failed to fetch IceCream data');
      }
    } catch (error) {
      setLoading(false);
      toastMsg({
        title: `${error.message}`,
        status: "error"
      });
    }
  };

  useEffect(() => { 
      getData();
  }, [total]);


  const handleQuery = () => {
    getData();
  };

  const handlePayment = () => {
    setPaymentLoading(true);
    makePayment(total, toastMsg);
    setPaymentLoading(false);
  }

  return (
    <div className='parentContainer'>
      <div className='searchContainer'>
        <div>
          <Input type="search" placeholder='Search here...' value={query} onChange={(e) => setQuery(e.target.value)}></Input>
          <Button id='sbtn' onClick={handleQuery}>Search</Button>
        </div>
        <div>
          <Button onClick={() => navigate("/register")} style={{ display: "none" }}> Add IceCream</Button>
          <Button >Total Amount: {total}</Button>
        </div>
      </div>
      <div className='tableContainer'>
        <TableContainer>
          <Table variant='striped'>
            <TableCaption>All IceCreams will be here</TableCaption>
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Flavour</Th>
                <Th>Description</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? <div id='loader'> <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl' /> <h1>Please Wait while data loading...</h1></div> : data.length == 0 ? <div id='loader'><h1 style={{ marginTop: "50px" }}>Your cart is empty</h1></div> : data.length > 0 && data.map((user) => (
                  <CartCard key={user.id} data={user} getData={getData} />
                ))}

            </Tbody>
          </Table>
          <Box>
            {paymentLoading ? <Button
              isLoading
              loadingText='Submitting'
              colorScheme='teal'
              variant='outline'
            >
              Submit
            </Button> : <Button
              onClick={handlePayment}>
              {"Place Your Order"}
            </Button>}

          </Box>
        </TableContainer>
      </div>
    </div>
  )
}

export default Cart