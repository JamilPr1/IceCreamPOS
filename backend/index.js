const jsonServer = require("json-server");
const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
        return;
      }
      callback(null, true);
    },
  })
);
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post("/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "").trim();
  const admin = router.db
    .get("admin")
    .find((user) => user.email.toLowerCase() === email && user.password === password)
    .value();

  if (admin) {
    res.json({ token: "local-admin-token" });
    return;
  }

  res.status(401).json({ error: "Invalid email or password" });
});

server.post("/create-order", (req, res) => {
  const amount = Number(req.body.amount) || 0;

  res.json({
    id: `order_local_${Date.now()}`,
    amount: Math.round(amount * 100),
  });
});

server.post("/purchases", (req, res) => {
  const db = router.db;
  const name = String(req.body.itemName || "").trim();
  const qty = Number(req.body.quantity);
  const price = Number(req.body.unitPrice);
  const purchaseDate = req.body.purchaseDate || new Date().toISOString().slice(0, 10);

  if (!name || !qty || qty <= 0 || !price || price <= 0) {
    res.status(400).json({ error: "Item name, quantity, and unit price are required" });
    return;
  }

  const invoiceNo =
    String(req.body.invoiceNo || "").trim() || `INV-${Date.now().toString().slice(-8)}`;
  const vendor = String(req.body.vendor || "").trim() || "Manual Entry";
  const category = String(req.body.category || "").trim() || "General";
  const unit = String(req.body.unit || "").trim() || "Units";
  const status = req.body.status || "Paid";
  const reorderLevel = Number(req.body.reorderLevel) || 10;

  const purchases = db.get("purchases");
  const purchaseId =
    purchases.value().reduce((max, entry) => Math.max(max, entry.id), 0) + 1;

  const purchase = {
    id: purchaseId,
    invoiceNo,
    vendor,
    itemName: name,
    category,
    quantity: qty,
    unit,
    unitPrice: price,
    totalAmount: qty * price,
    purchaseDate,
    status,
  };

  purchases.push(purchase).write();

  const inventory = db.get("businessInventory");
  const existing = inventory
    .value()
    .find((item) => item.itemName.toLowerCase() === name.toLowerCase());

  let inventoryRecord;
  let inventoryAction;

  if (existing) {
    inventoryRecord = {
      quantityOnHand: existing.quantityOnHand + qty,
      unitCost: price,
      category: category !== "General" ? category : existing.category,
      unit: unit !== "Units" ? unit : existing.unit,
      lastUpdated: purchaseDate,
    };
    inventory.find({ id: existing.id }).assign(inventoryRecord).write();
    inventoryRecord = { ...existing, ...inventoryRecord };
    inventoryAction = "updated";
  } else {
    const inventoryId =
      inventory.value().reduce((max, entry) => Math.max(max, entry.id), 0) + 1;
    inventoryRecord = {
      id: inventoryId,
      itemName: name,
      category,
      unit,
      quantityOnHand: qty,
      reorderLevel,
      unitCost: price,
      lastUpdated: purchaseDate,
    };
    inventory.push(inventoryRecord).write();
    inventoryAction = "created";
  }

  res.status(201).json({ purchase, inventory: inventoryRecord, inventoryAction });
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server running at http://localhost:${port}`);
});
