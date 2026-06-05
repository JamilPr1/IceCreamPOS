import React, { useEffect, useState, useCallback } from 'react';
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
} from "@chakra-ui/react";
import "../../styles/IceCream.css";
import { FaCartArrowDown } from "react-icons/fa"
import { useNavigate } from 'react-router-dom';
import UseToast from '../../customHook/UseToast';
import { Spinner } from '@chakra-ui/react'
import UserIceCreamCard from '../../components/UserIceCearmCard';
import { API_URL } from '../../config/api';

const Home = () => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const toastMsg = UseToast();


  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/iceCream`);
      const res = await response.json();
      const cartResponse = await fetch(`${API_URL}/cart`);
      const cartRes = await cartResponse.json();
      setCart(cartRes.length);
      if (response.ok) {
        setData([]);
        setData(res);
        setLoading(false);
      } else {
        console.log('Failed to fetch users data');
      }
    } catch (error) {
      setLoading(false);
      toastMsg({
        title: `${error.message}`,
        status: "error"
      });
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);


  const handleQuery = () => {
    getData();
  }

  return (
    <div className='parentContainer'>
      <div className='searchContainer'>
        <div>
          <Input type="search" placeholder='Search here...' value={query} onChange={(e) => setQuery(e.target.value)}></Input>
          <Button id='sbtn' onClick={handleQuery}>Search</Button>
        </div>
        <div>
          <Button onClick={() => navigate("/login")}>Admin</Button>
          <Button onClick={() => navigate("/cart")}>{<FaCartArrowDown />}{`:-${cart}`}</Button>
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
                <Th>Stock</Th>
                <Th>Add to Cart</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? <div id='loader'> <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl' /> <h1>Please Wait while data loading...</h1></div> : data.length > 0 && data.map((user) => (
                  <UserIceCreamCard key={user.id} data={user} getData={getData} />
                ))}

            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default Home