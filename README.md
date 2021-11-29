
1. **Pre-instructions**
    - node v14.16.0 has to be installed.
    - clone this git repo.
    - run "npm install"
    - run "node index.js"(Server will run on port 5000)
2. **Task**
    - Making an API call to LaCity API to fetch the visitors data by month(as API supports month parameter).
    - API Endpoint details to check this
    - **Example Curl:**-
    curl --location --request GET 'http://localhost:5000/api/visitors?date=1404198000000&ignore=avila_adobe'

3. **Code Structure**
  - index.js - contains API end point
  - requestUtils.js- generic function to make an API request
  - visitorsService.js(main logic) - get the visitors data and transform data of LACity API
  - testSuite.js - Contains test cases execution logic.
  - README.md - Contains details about the project
  - package.json, package-lock.json - packages related details
  - npm modules used - moment(date parsing), request(API requests), express(framework)
