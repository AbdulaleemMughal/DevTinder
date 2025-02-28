const express = require('express');

const app = express();


app.use("/test", (req, res) => {
    res.send("Hello from the test file");
});

app.get("/user", (req, res) => {
    res.send({ firstName: "Abdul Aleem", lastName: "Mughal"});
    res.send("Getting the data successfully")
});

app.post("/user", (req, res) => {
    res.send("Data saved to the database successfully");
});

app.delete("/user", (req, res) => {
    res.send("Data deleted successfully");
});

app.listen(7777, () => {
    console.log("Server is running on port 7777");
});