var Promise = require("bluebird");
var request = Promise.promisify(require('request'));


/*
 * @options   url           string      (Full Url)
 *            headers       object
 *            method        string      (Methods like GET, PUT, POST, DELETE, etc)
 *            body          object
 *            queryParams   object
 *            resourceName  string      string which describes the API
 */
class Request {

    constructor(options) {
        this.url = options.url;
        this.headers = options.headers || {};
        this.method = options.method;
        this.queryParams = options.queryParams;
        this.resourceName = options.resourceName;
    }

    async makeAPIRequest(body) {

        try {
            var reqOptions = {
                url: this.url,
                headers: this.headers,
                method: this.method,
                qs: this.queryParams
            };
            if (this.method === "POST" || this.method === "PUT") {
                reqOptions.body = JSON.stringify(body);
            }

            // console.info("<== request ==>", JSON.stringify(reqOptions));
            var response = await request(reqOptions)
            let result = response.body;
            // console.info("<== response ==>", result);
            try {
                result = JSON.parse(response.body);
            } catch (e) {
                console.error(`<=== Error in Parsing API Request ${this.resourceName} response ===>, \n<=== error ===> ${e} , \n<=== request Options  ===> ${JSON.stringify(reqOptions)}, \n<=== response ===>  ${JSON.stringify(result)}`);
                return Promise.reject(e);
            }
            return result;
        } catch (err) {
            console.error(`<=== Unhandled Error in API Request ${this.resourceName} ===>, \n<=== error ===> ${err}, \n<=== req Options ===> ${JSON.stringify(reqOptions)}`);
            return Promise.reject(err);
        };
    }

}


module.exports = {
    getInst: function(args){
        return new Request(args);
    }
}
