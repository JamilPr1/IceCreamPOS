import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Box,
    Input,
    FormControl,
    FormLabel,
    Select,
} from '@chakra-ui/react';
import { EditIcon } from "@chakra-ui/icons";
import axios from 'axios';
import UseToast from '../customHook/UseToast';
import { API_URL } from '../config/api';


export default function IceCreamUpdateModal({ id, getData, data }) {
    const [name, setName] = useState(data.name);
    const [flavour, setFlavour] = useState(data.Flavor);
    const [description, setDescription] = useState(data.Description);
    const [price, setPrice] = useState(data.Price);
    const [stock, setStock] = useState(data.Stock);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = React.useState();
    const toastMsg = UseToast();

    const handleIceCreamUpdate = async (id) => {
        //If user will not provide any updates then we will not make any api call
        if (name === data.name && flavour === data.Flavor && description === data.Description && price === data.Price && stock === data.Stock) {
            toastMsg({
                title: `Please provide any update in any of the following input fields`,
                status: "warning"
            });
            return;
        };
        if (name == "" || flavour == "" || description == "" || price == "" || stock == "") {
            toastMsg({
                title: `Please fill input and try again`,
                status: "warning"
            });
            return;
        };
        let obj = {
            name:name,
            Flavor: flavour,
            Description:description,
            Stock:stock,
            Price:price
          };

        axios.patch(`${API_URL}/iceCream/${id}`, obj).then((res) => {
            console.log("res",res);
            toastMsg({
                title: `IceCream data Updated successfully`,
                status: "success"
            });
            getData();
        }).catch((error) => {
            toastMsg({
                title: `error:- ${error.message}`,
                status: "error"
            });
        })
    }

    const OverlayTwo = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
        />
    )

    return (
        <>
            <Box
                ml='4'
                onClick={() => {
                    setOverlay(<OverlayTwo />)
                    onOpen()
                }}
            >
                <EditIcon /> Edit
            </Box>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader>Update items</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => {
                            handleIceCreamUpdate(id)
                            onClose()
                        }}>Submit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}