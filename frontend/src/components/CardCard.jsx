import React, { useState } from 'react';
import { Tr, Td, Image, Skeleton, Button, useStatStyles } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { BsThreeDotsVertical } from "react-icons/bs";


const CartCard = ({ data }) => {
  return (
    <>
      <Tr style={{ border: "2px solid teal" }}>
        <Td>{data.id}</Td>
        <Td>{data.name}</Td>
        <Td>{data.Flavor}</Td>
        <Td>{data.Description}</Td>
        <Td>{data.Price}</Td>
        <Td>{data.Quantity}</Td>
      </Tr>
    </>
  )
}

export default CartCard