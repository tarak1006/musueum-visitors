var apiRequestService = require("./requestUtil.js");
var CONSTANTS = require("./constants.js");
const INT_MAX = Number.MAX_SAFE_INTEGER;
var moment = require("moment");
var apiRequestService = require("./requestUtil.js");

class Visitors {
    constructor() {

    }

    validateDate(date) {
        if (!date) {
            return Promise.reject(new Error("query param date is missing"));
        }

        var dateMs = new Date(parseInt(date)).getTime();
        /* checking valid date and  number */
        if (isNaN(dateMs) || isNaN(date))
            return Promise.reject(new Error("Invalid date"));
    }

    convertDate(inputDate) {
        var date = moment(parseInt(inputDate)).utc().set({
            'date': 1,
            'hour': 0,
            'minute': 0,
            'second': 0,
            'millisecond': 0
        }).toISOString();

        return date;
    }

    validateResults(results) {
        if (!results || results.length === 0) {
            return Promise.reject(new Error("No Data Found"));
        }
    }

    constructResponse(results, date, ignoreMuseum) {
        var response = {
            "attendance": {}
        };

        /* default values */
        var minVisitors = INT_MAX,
            maxVisitors = -1,
            ignoreMuseumVisitors = -1,
            totalVisitors = 0;
        var minVisitorsMuseum, maxVisitorsMuseum;

        /* If in case multiple rows are there for a month then that can also be handled */
        results.forEach((result) => {
            delete result.month;

            /* constructing ignore musuem details */
            if (ignoreMuseum) {
                if (result.hasOwnProperty(ignoreMuseum)) {
                    if (ignoreMuseumVisitors !== -1) {
                        ignoreMuseumVisitors += parseInt(result[ignoreMuseum]);
                    } else {
                        ignoreMuseumVisitors = parseInt(result[ignoreMuseum]);
                    }
                    delete result[ignoreMuseum];
                }
            }

            /* constructing maximum and minimum visited musuem details */
            Object.keys(result).forEach((museum) => {
                var visitors = parseInt(result[museum]);
                if (visitors < minVisitors) {
                    minVisitors = visitors;
                    minVisitorsMuseum = museum;
                }
                if (visitors > maxVisitors) {
                    maxVisitors = visitors;
                    maxVisitorsMuseum = museum;
                }
                totalVisitors += visitors;
            });

        });
        var month = moment(date).format('MMM');
        var year = moment(date).format('YYYY');

        /*attaching the required details to response */
        if (ignoreMuseumVisitors !== -1) {
            response.attendance["ignored"] = {
                "museum": ignoreMuseum,
                "visitors": ignoreMuseumVisitors
            }
        }
        response.attendance = Object.assign(response.attendance, {
            "month": month,
            "year": year,
            "highest": {
                "museum": maxVisitorsMuseum,
                "visitors": maxVisitors
            },
            "lowest": {
                "museum": minVisitorsMuseum,
                "visitors": minVisitors
            },
            "total": totalVisitors
        });
        return response;
    }

    async getVisitorsDetails(queryParams) {
        try {
            var options = CONSTANTS.LACity;
            var ignoreMuseum = queryParams.ignore;

            /* validate input date and convert to required format */
            await this.validateDate(queryParams.date);
            var date = this.convertDate(queryParams.date);
            options.queryParams.month = date.slice(0, -1);

            /* make API request to LaCity API */
            var apiRequestServiceInst = apiRequestService.getInst(options);
            var results = await apiRequestServiceInst.makeAPIRequest({});

            /* validate and construct response */
            await this.validateResults(results);
            var response = this.constructResponse(results, date, ignoreMuseum);
            return response
        } catch (e) {
            console.error("<==== Error in fetching visitors details ===>", e);
            return Promise.reject(e);
        }
    }

};


module.exports = {
    getInst: function (args) {
        return new Visitors(args);
    }
}