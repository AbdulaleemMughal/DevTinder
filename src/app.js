const express = require('express');  
const app = express();

app.get("/", (req, res) => {  
    res.send("Hello from the dashboard");  
});  

app.get("/test", (req, res) => {  
    res.send("Hello from the test file");  
});  

app.get("/hello", (req, res) => {  
    res.send("Hello from the hello file");  
});  

app.listen(7777, () => {  
    console.log("Server is running on port 7777");  
});
