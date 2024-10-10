const http = require("http");
const App = require("./App")

const Server = http.createServer(App);

let PORT = process.env.PORT || 1234;
Server.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}...`);
});
  