const express = require("express");
app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

const morgan = require("morgan");
morgan.token("data", function (request, response) {
  data = JSON.stringify(request.body);
  return data;
});
app.use(
  morgan(
    "method: :method url: :url status: :status ms: :response-time ms data sent: :data"
  )
);

persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);

  person ? response.json(person) : response.status(404).end();
});

app.get("/info", (request, response) => {
  const date = new Date(Date.now());
  response.send(
    `Phone book has info of <b>${persons.length}</b> persons</br>
    ${date}`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const generatedId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  } else if (persons.find((p) => p.name === body.name)) {
    return response.status(409).json({
      error: "Name already in phone book",
    });
  }
  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
