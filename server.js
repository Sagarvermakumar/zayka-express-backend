import app from "./app.js";
import connectDB from "./config/database.js";


const PORT = process.env.PORT || 5000;


//connect to database
connectDB();


// Start the server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);


});

