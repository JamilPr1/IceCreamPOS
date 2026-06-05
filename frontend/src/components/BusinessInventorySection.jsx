import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Badge,
} from "@chakra-ui/react";
import { formatCurrency } from "../utils/dateFilters";

const BusinessInventorySection = ({ data, query }) => {
  const filtered = data.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <TableContainer>
      <Table variant="striped">
        <TableCaption>Business inventory stock levels</TableCaption>
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Item</Th>
            <Th>Category</Th>
            <Th>Qty On Hand</Th>
            <Th>Unit</Th>
            <Th>Reorder At</Th>
            <Th>Unit Cost</Th>
            <Th>Stock Value</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filtered.map((item) => {
            const lowStock = item.quantityOnHand <= item.reorderLevel;
            return (
              <Tr key={item.id} style={{ border: "2px solid teal" }}>
                <Td>{item.id}</Td>
                <Td>{item.itemName}</Td>
                <Td>{item.category}</Td>
                <Td>{item.quantityOnHand}</Td>
                <Td>{item.unit}</Td>
                <Td>{item.reorderLevel}</Td>
                <Td>{formatCurrency(item.unitCost)}</Td>
                <Td>{formatCurrency(item.quantityOnHand * item.unitCost)}</Td>
                <Td>
                  <Badge colorScheme={lowStock ? "red" : "green"}>
                    {lowStock ? "Low Stock" : "In Stock"}
                  </Badge>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default BusinessInventorySection;
