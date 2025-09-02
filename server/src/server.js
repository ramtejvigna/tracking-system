import express from "express"
import { PORT } from "./constants.js"
import cors from "cors"
import connectDB from "./lib/db.js";
import userRoutes from "./routes/userRoutes.js"
import attendanceRoutes from "./routes/attendanceRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);
app.use('/api', attendanceRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});