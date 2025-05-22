import { Server } from "http";
import app from "./app";

// const port = 3000;
const port = 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log("Review-Hub is running on port ", port);
  });
}

main();
