import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../config/api";
import UseToast from "../customHook/UseToast";
import { formatCurrency } from "../utils/dateFilters";

const findInventoryItem = (inventoryItems, name) => {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return null;
  return inventoryItems.find((item) => item.itemName.toLowerCase() === trimmed) || null;
};

const AddPurchaseModal = ({ getData, inventoryItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [vendor, setVendor] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Units");
  const [unitPrice, setUnitPrice] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Paid");
  const toastMsg = UseToast();

  const matchedItem = useMemo(
    () => findInventoryItem(inventoryItems, itemName),
    [inventoryItems, itemName]
  );

  const isNewItem = itemName.trim() && !matchedItem;

  const resetForm = () => {
    setInvoiceNo("");
    setVendor("");
    setItemName("");
    setCategory("");
    setQuantity("");
    setUnit("Units");
    setUnitPrice("");
    setReorderLevel("10");
    setPurchaseDate(new Date().toISOString().slice(0, 10));
    setStatus("Paid");
  };

  const applyExistingItemDefaults = (item) => {
    setCategory(item.category);
    setUnit(item.unit);
    setUnitPrice(String(item.unitCost));
  };

  const handleItemNameChange = (value) => {
    setItemName(value);
    const match = findInventoryItem(inventoryItems, value);
    if (match) {
      applyExistingItemDefaults(match);
    }
  };

  const handleItemNameBlur = () => {
    if (matchedItem) {
      applyExistingItemDefaults(matchedItem);
    }
  };

  const handleSubmit = async () => {
    const trimmedName = itemName.trim();

    if (!trimmedName || !quantity || !unitPrice) {
      toastMsg({ title: "Item name, quantity, and price are required", status: "warning" });
      return;
    }

    const qty = Number(quantity);
    const price = Number(unitPrice);

    if (qty <= 0 || price <= 0) {
      toastMsg({ title: "Quantity and price must be greater than zero", status: "warning" });
      return;
    }

    const payload = {
      invoiceNo: invoiceNo.trim(),
      vendor: vendor.trim(),
      itemName: trimmedName,
      category: category || "General",
      quantity: qty,
      unit: unit || "Units",
      unitPrice: price,
      purchaseDate,
      status,
      reorderLevel: Number(reorderLevel) || 10,
    };

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/purchases`, payload);
      const actionText =
        data.inventoryAction === "created"
          ? "New item added to inventory"
          : "Existing inventory updated";

      toastMsg({
        title: `Purchase saved. ${actionText}.`,
        status: "success",
      });
      resetForm();
      setIsOpen(false);
      getData();
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      toastMsg({ title: message, status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Purchase</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Purchase & Update Inventory</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3} isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input
                list="inventory-item-suggestions"
                value={itemName}
                onChange={(e) => handleItemNameChange(e.target.value)}
                onBlur={handleItemNameBlur}
                placeholder="Type item name (new or existing)"
              />
              <datalist id="inventory-item-suggestions">
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.itemName} />
                ))}
              </datalist>
            </FormControl>

            {itemName.trim() ? (
              <Box mb={3} className="adminPurchaseHint">
                <Text fontSize="sm" color={isNewItem ? "blue.600" : "green.600"}>
                  {isNewItem
                    ? "New item — will be added to business inventory."
                    : `Existing item — stock will increase from ${matchedItem.quantityOnHand} to ${matchedItem.quantityOnHand + (Number(quantity) || 0)}.`}
                </Text>
              </Box>
            ) : null}

            <FormControl mb={3} isRequired>
              <FormLabel>Quantity</FormLabel>
              <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </FormControl>

            <FormControl mb={3} isRequired>
              <FormLabel>Unit Price (PKR)</FormLabel>
              <Input type="number" min="1" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Category</FormLabel>
              <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Dairy">Dairy</option>
                <option value="Ingredients">Ingredients</option>
                <option value="Packaging">Packaging</option>
                <option value="Equipment">Equipment</option>
                <option value="General">General</option>
              </Select>
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Unit</FormLabel>
              <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="Units">Units</option>
                <option value="Liters">Liters</option>
                <option value="Kg">Kg</option>
                <option value="Pieces">Pieces</option>
                <option value="Boxes">Boxes</option>
              </Select>
            </FormControl>

            {isNewItem ? (
              <FormControl mb={3}>
                <FormLabel>Reorder Level</FormLabel>
                <Input type="number" min="1" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
              </FormControl>
            ) : null}

            <FormControl mb={3}>
              <FormLabel>Invoice No. (optional)</FormLabel>
              <Input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} placeholder="Auto-generated if empty" />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Vendor (optional)</FormLabel>
              <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Supplier name" />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Purchase Date</FormLabel>
              <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Payment Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </Select>
            </FormControl>

            {quantity && unitPrice ? (
              <p className="adminSummaryText">
                Invoice Total: {formatCurrency(Number(quantity) * Number(unitPrice))}
              </p>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={loading} onClick={handleSubmit}>
              Save Purchase
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddPurchaseModal;
