import express from "express";
import {
	uploadProcessedVideo,
	downloadRawVideo,
	deleteRawVideo,
	deleteProcessesVideo,
	convertVideo,
	setupDirectories,
} from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
	let data;

	try {
		const message = Buffer.from(req.body.message.data, "base64").toString(
			"utf-8"
		);
		data = JSON.parse(message);
		if (!data.name) {
			throw new Error("Invalid message payload");
		}
	} catch (err) {
		console.error(err);
		return res.status(400).send("Missing file name");
	}

	const inputFileName = data.name;
	const outPutFileName = `processed-${inputFileName}`;

	await downloadRawVideo(inputFileName);

	try {
		await convertVideo(inputFileName, outPutFileName);
	} catch (err) {
		await Promise.all([
			deleteRawVideo(inputFileName),
			deleteProcessesVideo(inputFileName),
		]);
		return res.status(500).send("Unable to process");
	}

	await uploadProcessedVideo(outPutFileName);

	await Promise.all([
		deleteRawVideo(inputFileName),
		deleteProcessesVideo(inputFileName),
	]);

	return res.status(200).send("Conversion successful");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
