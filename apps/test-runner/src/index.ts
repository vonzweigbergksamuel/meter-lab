import { RabbitServive } from "./service/rabbit.js";

const rs = new RabbitServive()

await rs.connect()
rs.listenQueue()

console.log("Hello World");
