var testCases = [{"date": "1404198000000", "ignore": "avila_adobe"}, {"date": "1404198000000"}]
var visitorsService = require("./visitorsService.js");




function testSuite(){
    var visitorsServiceInst = visitorsService.getInst();
    testCases.forEach(async function(testCase, index){
        var response = await visitorsServiceInst.getVisitorsDetails(testCase);

        console.log(`Test Case ${index+1}: \n Input : ${JSON.stringify(testCase)} \n Output: ${JSON.stringify(response)} \n\n`)
    });
}



testSuite();










