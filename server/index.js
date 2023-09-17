const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04cbabee9069c8609f9d8a125bce359078503d8a31403a4c16bd50ca3b5f1bc4ea74230461239a7c8923a3ecf0da64053df8dfd4204dc4f62b61434f88df2e1ce3": 100,
  "046cc2726806fb32399a3b0a61605c0fa3105e98e6dede212e0e42417eedf62cb64f563c9f5b4e560ff10bd75269326ac45171dd6589f4bba4cbb6631af522f457": 50,
  "04b32d676b5dfc7c555f1a3c356ee99e4a079477db7452ece990abf6177bb2f98af780300cd8adef460a47a9eca5ab1f5dd412c07f0638d0abce0bc929fbe43f60": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
