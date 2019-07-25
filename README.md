# React - BI Sales Application


This is an application to demonstrate the use of a number of technologies associated with React.

It is a browser-based BI tool, where a user is able to create ad-hoc reports by dragging dimensions onto a table. Dimensions may be dragged between columns and rows, reordered and dimension items may be included or excluded. Each time a change is made to the report it is re-calculated on the server.

The server application is based on my own npm package, star-search (https://www.npmjs.com/package/star-search) which is an implementation of a star-schema optimization in JavaScript. It allows a large dataset to be filtered by arbituary sets of dimension values very efficiently; with a single parse of the fact data array. It can be queried directly using GraphQL. The webserver used is hapi.

On the client side, material-ui has been used to provide the look-and-feel. State management has been implemented using React hooks and server requests are made using axios.

### To install
Install Node.js 

`npm i`

`npm run populate`

`npm run build`

### To start
`npm start`

##### The client 
http://localhost:8080

##### The server
http://localhost:8080/graphql

To do:
- Choose a good colour palette for the chart.
- Add drop and click interactions for the chart
- Fix auto-scaling
- Dockerize
- Deploy to AWS
- Write Blog
 
docker build -t=dashboard .
docker run -p 3000:8080 dashboard
