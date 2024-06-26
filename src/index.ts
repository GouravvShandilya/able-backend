// src/index.js
import {app} from "./app";

const port = process.env.PORT || 4000;


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
