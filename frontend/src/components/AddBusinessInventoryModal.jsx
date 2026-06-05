import React, { useState } from "react";
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
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../config/api";
import UseToast from "../customHook/UseToast";

const AddBusinessInventoryModal = ({ getData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [quantityOnHand, setQuantityOnHand] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const toastMsg = UseToast();

  const resetForm = () => {
    setItemName("");
    setCategory("");
    setUnit("");
    setQuantityOnHand("");
    setReorderLevel("");
    setUnitCost("");
  };

  const handleSubmit = () => {
    if (!itemName || !category || !unit || !quantityOnHand || !reorderLevel || !unitCost) {
      toastMsg({ title: "Please fill all fields", status: "warning" });
      return;
    }

    const obj = {
      itemName,
      category,
      unit,
      quantityOnHand: Number(quantityOnHand),
      reorderLevel: Number(reorderLevel),
      unitCost: Number(unitCost),
      lastUpdated: new Date().toISOString().slice(0, 10),
    };

    setLoading(true);
    axios
      .post(`${API_URL}/businessInventory`, obj)
      .then(() => {
        toastMsg({ title: "Inventory item added", status: "success" });
        resetForm();
        setIsOpen(false);
        getData();
      })
      .catch((error) => {
        toastMsg({ title: error.message, status: "error" });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Inventory Item</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Business Inventory Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Item Name</FormLabel>
              <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g. Whole Milk" />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Category</FormLabel>
              <Select placeholder="Select category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Dairy">Dairy</option>
                <option value="Ingredients">Ingredients</option>
                <option value="Packaging">Packaging</option>
                <option value="Equipment">Equipment</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Unit</FormLabel>
              <Select placeholder="Select unit" value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="Liters">Liters</option>
                <option value="Kg">Kg</option>
                <option value="Pieces">Pieces</option>
                <option value="Boxes">Boxes</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Quantity On Hand</FormLabel>
              <Input type="number" value={quantityOnHand} onChange={(e) => setQuantityOnHand(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Reorder Level</FormLabel>
              <Input type="number" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Unit Cost (PKR)</FormLabel>
              <Input type="number" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={loading} onClick={handleSubmit}>
              Save Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddBusinessInventoryModal;
