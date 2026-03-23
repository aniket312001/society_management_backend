require("dotenv").config();

    console.log("in my profile");
const app = require("./src/app");

const PORT = process.env.PORT;

app.listen(PORT,'0.0.0.0', () => {
  console.log("Server running on port " + PORT);
});

// ngrok http 3000