const express = require("express");
const app = express();
var bodyParser = require('body-parser');
var visitorsService = require("./visitorsService.js");

const port = process.env.port || 5000;

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

/* get LaCity museum visitors */
app.get("/api/visitors", async function (req, res) {
	try{
		var visitorsServiceInst = visitorsService.getInst();
		var response = await visitorsServiceInst.getVisitorsDetails(req.query);
		return res.send(response);
	}
	catch(e){
		return res.send({"msg": e.message, "status": "failed"});
	}
});

app.listen(port, () =>
	console.log(`Example app listening at http://localhost:${port}`)
);