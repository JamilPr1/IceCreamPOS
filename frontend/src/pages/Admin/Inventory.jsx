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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import "../../styles/IceCream.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import UseToast from '../../customHook/UseToast';
import IceCreamCard from '../../components/IceCreamcard';
import BusinessInventorySection from '../../components/BusinessInventorySection';
import PurchasesSection from '../../components/PurchasesSection';
import SalesReportPanel from '../../components/SalesReportPanel';
import AddBusinessInventoryModal from '../../components/AddBusinessInventoryModal';
import AddPurchaseModal from '../../components/AddPurchaseModal';
import { API_URL } from '../../config/api';

const Inventory = () => {
  const [iceCreamData, setIceCreamData] = useState([]);
  const [businessInventory, setBusinessInventory] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const toastMsg = UseToast();

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const [iceRes, inventoryRes, purchasesRes, salesRes] = await Promise.all([
        fetch(`${API_URL}/iceCream`),
        fetch(`${API_URL}/businessInventory`),
        fetch(`${API_URL}/purchases`),
        fetch(`${API_URL}/sales`),
      ]);

      const [iceCream, inventory, purchaseList, salesList] = await Promise.all([
        iceRes.json(),
        inventoryRes.json(),
        purchasesRes.json(),
        salesRes.json(),
      ]);

      if (iceRes.ok) setIceCreamData(iceCream);
      if (inventoryRes.ok) setBusinessInventory(inventory);
      if (purchasesRes.ok) setPurchases(purchaseList);
      if (salesRes.ok) setSales(salesList);
    } catch (error) {
      toastMsg({
        title: `${error.message}`,
        status: "error"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleQuery = () => {
    getData();
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const filteredIceCream = iceCreamData.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.Flavor || "").toLowerCase().includes(q)
    );
  });

  const renderActions = () => {
    if (activeTab === 0) {
      return (
        <Button onClick={() => navigate("/addicecream")}>
          <AiOutlinePlus /> Add IceCream
        </Button>
      );
    }
    if (activeTab === 1) {
      return (
        <>
          <AddBusinessInventoryModal getData={getData} />
          <AddPurchaseModal getData={getData} inventoryItems={businessInventory} />
        </>
      );
    }
    if (activeTab === 2) {
      return <AddPurchaseModal getData={getData} inventoryItems={businessInventory} />;
    }
    return null;
  };

  return (
    <div className='parentContainer'>
      <div className='searchContainer'>
        <div>
          <Input
            type="search"
            placeholder='Search here...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button id='sbtn' onClick={handleQuery}>Search</Button>
        </div>
        <div className="adminActionBar">
          {renderActions()}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      <div className='tableContainer'>
        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" colorScheme="blue">
          <TabList className="adminTabList">
            <Tab>Ice Cream Menu</Tab>
            <Tab>Business Inventory</Tab>
            <Tab>Purchases & Invoices</Tab>
            <Tab>Sales Reports</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {loading ? (
                <div id='loader'>
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
                  <h1>Please Wait while data loading...</h1>
                </div>
              ) : (
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
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredIceCream.map((user) => (
                        <IceCreamCard key={user.id} data={user} getData={getData} />
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            <TabPanel px={0}>
              {loading ? (
                <div id='loader'>
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
                  <h1>Please Wait while data loading...</h1>
                </div>
              ) : (
                <BusinessInventorySection data={businessInventory} query={query} />
              )}
            </TabPanel>

            <TabPanel px={0}>
              {loading ? (
                <div id='loader'>
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
                  <h1>Please Wait while data loading...</h1>
                </div>
              ) : (
                <PurchasesSection data={purchases} query={query} />
              )}
            </TabPanel>

            <TabPanel px={0}>
              {loading ? (
                <div id='loader'>
                  <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
                  <h1>Please Wait while data loading...</h1>
                </div>
              ) : (
                <SalesReportPanel data={sales} query={query} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
