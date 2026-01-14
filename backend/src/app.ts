import express from "express"; //import express
import getConnection from "./config/db";
import "dotenv/config";
import router from "./routes/auth";
import cookieParser from "cookie-parser";

const app = express(); // tạo express application
const port = 8080; // init port

//middleware
app.use(express.json());
app.use(cookieParser);

app.use("/api/auth", router);

getConnection();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
