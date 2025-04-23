 
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));


const razorpay = new Razorpay({
  key_id: "rzp_test_YourKeyID",
  key_secret: 
});

app.post("/create-order", async (req, res) => {
  const options = {
    amount: 50000, 
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => console.log("Server started at http://localhost:3000"));
