import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useColorModeValue,
  Select,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react';
import axios from "axios";
import UseToast from '../../customHook/UseToast';
import { API_URL } from '../../config/api';

const AddIcecream = () => {
  const [name, setName] = useState("");
  const [flavour, setFlavour] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const toastMsg = UseToast();

  const handleIceCream = async () => {
    let obj = {
      name:name,
      Flavor: flavour,
      Description:description,
      Stock:stock,
      Price:price
    };

    setLoading(true);
      axios.post(`${API_URL}/iceCream`, obj).then((res) => {
        setLoading(false);
        toastMsg({
          title: "Data Added successfully",
          status: "success"
        });
      }).catch((error) => {
        setLoading(false);
        toastMsg({
          title: `${error}`,
          status: "error"
        })
      });
  }


  return (
    <div>
      <div>
        <Box
          w={{ base: "100%", md: "48%" }}
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          p={8}
          margin="auto"
          marginTop="20px"
          style={{border:"1px solid gray"}}
        >
          <Stack spacing={4}>
            <FormControl id="Name">
              <FormLabel>Name</FormLabel>
              <Input type="text" placeholder='IceCream Name' value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="Flavour">
              <FormLabel>Select Flavour</FormLabel>
              <Select placeholder='Select Flavour' value={flavour} onChange={(e) => setFlavour(e.target.value)}>
                <option value="Chocolate">Chocolate</option>
                <option value="Vanilla">Vanilla</option>
                <option value="Strawberry">Strawberry</option>
                <option value="Mint">Mint</option>
              </Select>
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Input type="text" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl id="price">
              <FormLabel>Price</FormLabel>
              <Input type="number" placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
            </FormControl>
            <FormControl id="stock">
              <FormLabel>Total Stock</FormLabel>
              <Input type="number" placeholder='Stock' value={stock} onChange={(e) => setStock(e.target.value)} />
            </FormControl>
          </Stack>
        </Box>
      </div>
      <div className='btn'>
        {loading ? <Button
          isLoading
          loadingText='Submitting'
          colorScheme='blue'
          variant='outline'
        >
          Submit
        </Button> : <Button onClick={handleIceCream}>Submit</Button>}

      </div>
    </div>
  )
}

export default AddIcecream