import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ message: "Express server is running." });
});

app.listen(PORT, () => {
	console.log(`Server started at http://localhost:${PORT}`);
});
