import express from "express"; //import express
import getConnection from "./config/db";
import "dotenv/config";
import routerAuth from "./routes/auth";
import routerUser from "./routes/user";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/auth";

const app = express(); // tạo express application
const port = 8080; // init port

//middleware
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", routerAuth);
app.use(protectedRoute);
app.use("/api/users", routerUser);

getConnection();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
