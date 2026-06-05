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

const PurchasesSection = ({ data, query }) => {
  const filtered = data.filter((purchase) => {
    const q = query.toLowerCase();
    return (
      purchase.invoiceNo.toLowerCase().includes(q) ||
      purchase.vendor.toLowerCase().includes(q) ||
      purchase.itemName.toLowerCase().includes(q)
    );
  });

  const totalSpend = filtered.reduce((sum, row) => sum + row.totalAmount, 0);

  return (
    <>
      <p className="adminSummaryText">
        Total purchase value (filtered): {formatCurrency(totalSpend)}
      </p>
      <TableContainer>
        <Table variant="striped">
          <TableCaption>Purchase invoices and vendor records</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Invoice No.</Th>
              <Th>Vendor</Th>
              <Th>Item</Th>
              <Th>Qty</Th>
              <Th>Unit Price</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((purchase) => (
              <Tr key={purchase.id} style={{ border: "2px solid teal" }}>
                <Td>{purchase.id}</Td>
                <Td>{purchase.invoiceNo}</Td>
                <Td>{purchase.vendor}</Td>
                <Td>{purchase.itemName}</Td>
                <Td>
                  {purchase.quantity} {purchase.unit}
                </Td>
                <Td>{formatCurrency(purchase.unitPrice)}</Td>
                <Td>{formatCurrency(purchase.totalAmount)}</Td>
                <Td>{purchase.purchaseDate}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      purchase.status === "Paid"
                        ? "green"
                        : purchase.status === "Pending"
                        ? "orange"
                        : "yellow"
                    }
                  >
                    {purchase.status}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PurchasesSection;
