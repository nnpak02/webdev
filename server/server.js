const express = require("express");
const app = express();
const PORT = 8000;
const cors = require("cors");
app.use(cors());

const customers = [
  { id: 1234, name: "Steven Adams", birthdate: "1980-01-02" },
  { id: 5678, name: "James Lukather", birthdate: "1980-01-02" },
];

app.use(express.json());

const convert = response => response.json()
const url = "https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec" ;
const logs_url = "https://app-tracking.pockethost.io/api/collections/drone_logs/records"

app.post("/logs",async (req,res)=>{
  console.log("posting log data");
  console.log(req.body);
  const rawData = await fetch(logs_url,
    {
      method : "POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body :JSON.stringify(req.body)
    });
  res.send("OK");
})


app.get("/logs",async(req,res)=>{
console.log("/logs")
const rawData = await fetch(logs_url,{method:"GET"});
const jsonData = await rawData.json();
const logs = jsonData.items ;
res.send(logs);
})

app.get("/config/:id", async (req,res)=>{
  const id = req.params.id
  const rawData = await fetch (url,{method: 'GET'});
  const jsonData = await rawData.json();
  
  const drones = jsonData.data;
  const myDrone = drones.find(item => item.drone_id == id)
  console.log(myDrone)

  const max = (myDrone.max_speed = null) ? 100: myDrone.max_speed = 100 ;
  console.log(max);

  myDrone.max_speed = !myDrone.max_speed ? 100 : myDrone.max_speed;
  myDrone.max_speed = myDrone.max_speed > 110 ? 110 : myDrone.max_speed;


  res.send(myDrone);
  

} ) 

app.get("/", (req, res) => {
  res.send("Hello nn");
});

app.get("/customers", (req, res) => {

  res.send(customers);
})


app.get("/customers/:id", (req, res) => {

  const id = req.params.id;

  const myCustomer = customers.find(item => item.id == id);

  if (!myCustomer) { 

    res.status(404).send({ status: "error", message: "Customer not found" });

  } else {

    res.send(myCustomer);
  }

})

app.delete("/customers/:id", (req, res) => {
 
  const id = req.params.id;

  const index = customers.findIndex(item => item.id == id);

  customers.splice(index, 1);

  res.send({ status: "success", message: "Customer deleted" });
})

app.post("/customers", (req, res) => {

  const newCustomer = req.body;

  customers.push(newCustomer);

  res.send({ status: "success", message: "Customer created" });
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));