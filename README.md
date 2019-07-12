# React - BI Sales Application


This is an application to demonstrate the use of a number of technologies associated with the React.

Its is a browser based BI tool where a user is able to create ad-hoc sales reports by dragging dimensions onto a table. Dimensions may be dragged between columns and rows, reordered and items included and excluded. Each time a change is made a new report is calculated on the server.

The server application is based on my own npm package, star-search (https://www.npmjs.com/package/star-search) which is an implementation of a star-schema optimization JavaScript. It allows a large dataset to be filtered but multiple attribute sets very efficiently. It can be queried directly using GraphQL. The webserver is used is hapi.

On the client side material-ui has been used to provide the look-and-feel. State management has been implemented using React Hooks and server requests are made using axios.

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


