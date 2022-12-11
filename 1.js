const fs = require("fs");
const http = require("http");
const url = require("url");

http.createServer((req, res) => {
	const urlParsed = url.parse(req.url);
	console.log(urlParsed);
	const pathName = urlParsed.pathname;

	if (pathName === "/users") {
		const method = req.method;
		const fileData = JSON.parse(fs.readFileSync("data.json"));
		if (method === "GET") {
			// FOR ALL USERS

			if (!urlParsed.query) {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(fileData));
			} else {
				// FOR SPECIFIC ID

				const data = new URLSearchParams(urlParsed.query);
				const objectData = {};
				for (const temp of data.entries()) {
					objectData[temp[0]] = temp[1];
				}
				res.write(JSON.stringify(fileData[objectData["ID"]]));
				res.end("\nServer Killed");
			}
		} else if (method === "POST") {
			const buffer = [];
			req.on("data", (data) => {
				buffer.push(data);
			}).on("end", () => {
				const temp = Buffer.concat(buffer).toString();
				const data = new URLSearchParams(temp);
				const objectData = {};
				for (const temp of data.entries()) {
					objectData[temp[0]] = temp[1];
				}
				const totalKeys = Object.keys(fileData).length + 1;
				const combinedData = { ...fileData, [totalKeys]: objectData };
				fs.writeFileSync("data.json", JSON.stringify(combinedData));
				res.end("Data Added\nKilling Server");
			});
		} else if (method === "DELETE") {
			const buffer = [];
			req.on("data", (data) => {
				buffer.push(data);
			}).on("end", () => {
				const temp = Buffer.concat(buffer).toString();
				const data = new URLSearchParams(temp);
				const objectData = {};
				for (const temp of data.entries()) {
					objectData[temp[0]] = temp[1];
				}
				delete fileData[objectData["id"]];
				fs.writeFileSync("data.json", JSON.stringify(fileData));
				res.end("Data Deleted\nKilling Server");
			});
		} else {
			res.writeHead(404, { "Content-type": "text/html" });
		}
	}
}).listen(8081);
