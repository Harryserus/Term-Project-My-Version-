import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(PORT, () => {
    console.log(`Access the server at http://localhost:${PORT}`);
})