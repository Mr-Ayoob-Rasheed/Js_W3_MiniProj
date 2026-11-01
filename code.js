
// Current warehouse stock
const stock = {
  laptop: 5,
  mouse: 10,
  keyboard: 5
};

// Queue of orders teek aor ghalat orders, to test
const orders = [
  {id:1001, customer: "Ayesha", item: "mouse", quantity: 3, packingTimeMs: 500 },
  {id:1002, customer: "", item: "laptop", quantity: 1, packingTimeMs: 300 },      // Missing name
  {id:1003, customer: "Bilal", item: "laptop", quantity: -3, packingTimeMs: 400 },     // Negative quantity
  {id:1004, customer: "Chaudhry", item: "keyboard", quantity: "five", packingTimeMs: 200 }, // String quantity
  {id:1001, customer: "Dania", item: "mouse", quantity: 1, packingTimeMs: 300 },      // Duplicate ID
  {id:1005, customer: "Eman", item: "keyboard", quantity: 3, packingTimeMs: 600 },     // Out of stock
  {id:1006, customer: "Faisal", item: "mouse", quantity: 2, packingTimeMs: 400 }      // Valid
];

// to store already seen ids
const seenIds = [];

// Array to store what happens to every order
const eventLog = [];

// Helper function to pause execution for a given time
function wait(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}


async function processOrders() {
  console.log("Starting Order Processing\n");

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    // --- STEP A: VALIDATE DATA ---

    // missing name checking
    if (!order.customer || order.customer === "") {
      console.warn("⚠️ Order #" + order.id + " skipped: missing customer name.");
      eventLog.push("INVALID_DATA");
      continue; // Skip to next order
    }

    // valid qty honi chahie
    if (typeof order.quantity !== "number" || order.quantity <= 0) {
      console.warn("⚠️ Order #" + order.id + " skipped: quantity must be a positive number.");
      eventLog.push("INVALID_DATA");
      continue;
    }

    // order id unique hona chahie
    if (seenIds.includes(order.id)) {
      console.warn("⚠️ Order #" + order.id + " skipped: duplicate order ID.");
      eventLog.push("INVALID_DATA");
      continue;
    }

    // Check missing packing time
    if (!order.packingTimeMs) {
      console.warn("⚠️ Order #" + order.id + " skipped: missing packing time.");
      eventLog.push("INVALID_DATA");
      continue;
    }

    // this order is valid, add to seenIds
    seenIds.push(order.id);

    //step b: inventory check

    const currentStock = stock[order.item];
    // Check if item exists or is out of stock
    if (currentStock === undefined || currentStock < order.quantity) {
      console.warn("❌ Order #" + order.id + " rejected: item out of stock.");
      eventLog.push("OUT_OF_STOCK");
      continue;
    }

    //step c: packing

    console.log("📦 Packing Order #" + order.id + " (" + order.quantity + "x " + order.item + ") for " + order.customer + "...");
    await wait(order.packingTimeMs);
    stock[order.item] = stock[order.item] - order.quantity;

    console.log("✅ Order #" + order.id + " packed! Time spent: " + order.packingTimeMs + "ms. Remaining " + order.item + " stock: " + stock[order.item] + "\n");

    eventLog.push("PACKED");
  }

  //step d: final report
  printReport();
}

// 3. REPORTING

function printReport() {
  let packedCount = 0;
  let invalidCount = 0;
  let outOfStockCount = 0;

  // Count outcomes from eventLog
  for (let i = 0; i < eventLog.length; i++) {
    if (eventLog[i] === "PACKED") packedCount++;
    if (eventLog[i] === "INVALID_DATA") invalidCount++;
    if (eventLog[i] === "OUT_OF_STOCK") outOfStockCount++;
  }

  console.log("FINAL REPORT");
  console.log("               ");
  console.log("Total Orders Processed: " + orders.length);
  console.log("Successfully Packed: " + packedCount);
  console.log("Rejected (Invalid Data): " + invalidCount);
  console.log("Rejected (Out of Stock): " + outOfStockCount);
  console.log("Final Stock Levels:", stock);
}

processOrders();