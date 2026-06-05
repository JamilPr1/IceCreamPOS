import React, { useState } from 'react';
import { Tr, Td, Button, Input } from "@chakra-ui/react";
import axios from 'axios';
import UseToast from '../customHook/UseToast';
import { API_URL } from '../config/api';



const UserIceCreamCard = ({ data, getData }) => {
  const [iceCream, setIceCream] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stocks, setStock] = useState(data.stock);
  const toastMsg = UseToast();
  const handleCart = () => {
    let remainingStocks = (data.Stock - iceCream);

    let obj = {
      name: data.name,
      Flavor: data.Flavor,
      Description: data.Description,
      Price: data.Price,
      Quantity: iceCream
    }
    setLoading(true);
    axios.post(`${API_URL}/cart`, obj).then((res) => {
      setLoading(false);
      toastMsg({
        title: `Added into cart`,
        status: "success"
      });
    }).catch((error) => {
      setLoading(false);
      console.log(error);
      toastMsg({
        title: `${error.message}`,
        status: "error"
      });
    });

    axios.patch(`${API_URL}/iceCream/${data.id}`, { Stock: remainingStocks }).then((res) => {
      console.log(res);
      getData();
    }).catch((error) => {
      console.log(error);
    });
  }
  return (
    <>
      <Tr style={{ border: "2px solid teal" }}>
        <Td>{data.id}</Td>
        <Td>{data.name}</Td>
        <Td>{data.Flavor}</Td>
        <Td>{data.Description}</Td>
        <Td>{data.Price}</Td>
        <Td>{data.Stock}</Td>
        <Td><Input value={iceCream} onChange={(e) => setIceCream(e.target.value)} width={"100px"} border={"1px solid gray"} type="number" placeHolder="IceCream"></Input>{loading ? <Button
          isLoading
          loadingText='Adding'
          colorScheme='teal'
          variant='outline'
        >
          Submit
        </Button> : <Button onClick={handleCart} isDisabled={data.Stock <= 0}> {"Add to Cart"}</Button>}</Td>
      </Tr>
    </>
  )
}

export default UserIceCreamCard