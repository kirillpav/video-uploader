// GCS Files
// Local files

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucket = "kirill-yt-raw-videos";
const processedVideoBucket = "kirill-yt-processed-videos";

const localRawVidPath = "./rawVideos";
const localProcessedVidPath = "./processedVideos";

export function setupDirectories() {
	ensureDirExists(localRawVidPath);
	ensureDirExists(localProcessedVidPath);
}

export function convertVideo(
	rawInputVideoName: string,
	processedVideoName: string
) {
	return new Promise<void>((resolve, reject) => {
		ffmpeg(`${localRawVidPath}/${rawInputVideoName}`)
			.outputOptions("-vf", "scale=-1:360") // 360p
			.on("end", function () {
				console.log("Processing finished successfully");
				resolve();
			})
			.on("error", function (err: any) {
				console.log("An error occurred: " + err.message);
				reject(err);
			})
			.save(`${localProcessedVidPath}/${processedVideoName}`);
	});
}

export async function downloadRawVideo(fileName: string) {
	await storage
		.bucket(rawVideoBucket)
		.file(fileName)
		.download({ destination: `${localRawVidPath}/${fileName}` });
	console.log(
		`gs://${rawVideoBucket}/${fileName} downloaded to ${localRawVidPath}/${fileName}`
	);
}

export async function uploadProcessedVideo(fileName: string) {
	const bucket = storage.bucket(processedVideoBucket);

	await bucket.upload(`${localProcessedVidPath}/${fileName}`, {
		destination: fileName,
	});

	console.log(
		`${localProcessedVidPath}/${fileName} uploaded to gs://${processedVideoBucket}/${fileName}.`
	);

	await bucket.file(fileName).makePublic();
}

export function deleteRawVideo(fileName: string) {
	return deleteFile(`${localRawVidPath}/${fileName}`);
}

export function deleteProcessesVideo(fileName: string) {
	return deleteFile(`${localProcessedVidPath}/${fileName}`);
}

function deleteFile(filePath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (fs.existsSync(filePath)) {
			fs.unlink(filePath, (err) => {
				if (err) {
					console.log(`Deletion of file at ${filePath} not successfull`, err);
					reject(err);
				} else {
					console.log(`Deletion of file at ${filePath} successfull`);
					resolve();
				}
			});
		} else {
			console.log(`File at ${filePath} not found`);
			resolve();
		}
	});
}

function ensureDirExists(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
		console.log(`Directory created at ${dirPath}`);
	}
}
