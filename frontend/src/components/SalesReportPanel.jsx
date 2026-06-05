import React, { useMemo, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Input,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { filterByDateRange, formatCurrency } from "../utils/dateFilters";

const SalesReportPanel = ({ data, query }) => {
  const [range, setRange] = useState("daily");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const rangedSales = useMemo(
    () => filterByDateRange(data, "saleDate", range, customFrom, customTo),
    [data, range, customFrom, customTo]
  );

  const filtered = rangedSales.filter((sale) => {
    const q = query.toLowerCase();
    return (
      sale.orderId.toLowerCase().includes(q) ||
      sale.itemName.toLowerCase().includes(q)
    );
  });

  const totalRevenue = filtered.reduce((sum, row) => sum + row.totalAmount, 0);
  const totalUnits = filtered.reduce((sum, row) => sum + row.quantity, 0);
  const uniqueOrders = new Set(filtered.map((row) => row.orderId)).size;
  const avgOrderValue = uniqueOrders ? totalRevenue / uniqueOrders : 0;

  return (
    <>
      <Box className="adminRangeBar">
        <Button
          id={range === "daily" ? "sbtn" : undefined}
          variant={range === "daily" ? "solid" : "outline"}
          onClick={() => setRange("daily")}
        >
          Daily
        </Button>
        <Button
          variant={range === "weekly" ? "solid" : "outline"}
          onClick={() => setRange("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={range === "monthly" ? "solid" : "outline"}
          onClick={() => setRange("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={range === "custom" ? "solid" : "outline"}
          onClick={() => setRange("custom")}
        >
          Custom Range
        </Button>
      </Box>

      {range === "custom" && (
        <Box className="adminCustomRange">
          <Input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} />
          <Input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} />
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} className="adminStatsGrid">
        <Stat className="adminStatCard">
          <StatLabel>Total Revenue</StatLabel>
          <StatNumber>{formatCurrency(totalRevenue)}</StatNumber>
        </Stat>
        <Stat className="adminStatCard">
          <StatLabel>Units Sold</StatLabel>
          <StatNumber>{totalUnits}</StatNumber>
        </Stat>
        <Stat className="adminStatCard">
          <StatLabel>Orders</StatLabel>
          <StatNumber>{uniqueOrders}</StatNumber>
        </Stat>
        <Stat className="adminStatCard">
          <StatLabel>Avg Order Value</StatLabel>
          <StatNumber>{formatCurrency(avgOrderValue)}</StatNumber>
        </Stat>
      </SimpleGrid>

      <TableContainer>
        <Table variant="striped">
          <TableCaption>Sales transactions for selected period</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Order Id</Th>
              <Th>Item</Th>
              <Th>Qty</Th>
              <Th>Unit Price</Th>
              <Th>Total</Th>
              <Th>Sale Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.length === 0 ? (
              <Tr>
                <Td colSpan={7}>No sales found for this period</Td>
              </Tr>
            ) : (
              filtered.map((sale) => (
                <Tr key={sale.id} style={{ border: "2px solid teal" }}>
                  <Td>{sale.id}</Td>
                  <Td>{sale.orderId}</Td>
                  <Td>{sale.itemName}</Td>
                  <Td>{sale.quantity}</Td>
                  <Td>{formatCurrency(sale.unitPrice)}</Td>
                  <Td>{formatCurrency(sale.totalAmount)}</Td>
                  <Td>{sale.saleDate}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SalesReportPanel;
