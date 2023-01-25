const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

// Middleware

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find(customer => customer.cpf === cpf);
  if (!customer) {
    return res.status(400).json({ error: "Customer not found" });
  }

  req.customer = customer;

  return next();
}

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
});

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

  if (customerAlreadyExists) {
    return res.status(400).send({ error: "Customer already exists!" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });

  return res.status(201).send();
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { amount, description } = req.body;
  const { customer } = req;

  const statementOperation = {
    amount,
    description,
    created_at: new Date(),
    type: "credit"
  };

  customer.statement.push(statementOperation);
  return res.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { amount, description } = req.body;
  const { customer } = req;

  const statementOperation = {
    amount,
    description,
    created_at: new Date(),
    type: "credit"
  };

  customer.statement.push(statementOperation);
  return res.status(201).send();
});

app.listen(3333);