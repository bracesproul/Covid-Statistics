# Overview

## Technologies
This app was developed using React.JS and the Next.JS framework
It uses [Axios](https://www.npmjs.com/package/axios) to make API calls
The environment variables are handeled by the [dotenv](https://www.npmjs.com/package/dotenv) NPM package


## APIs
All APIs are from [Rapid API](https://rapidapi.com/)
The COVID-19 data is provided by the [COVID-19 API](https://rapidapi.com/axisbits-axisbits-default/api/covid-19-statistics/)
The world population data is provided by the [World Population API](https://rapidapi.com/aldair.sr99/api/world-population/)


## Overview
This app displays the current COVID-19 statistics for the world and for each country.
The overview with 20 countries and the world data is displayed by default on the homepage
You can either click on "Get more data" on one of the given countries to view more detailed data and graphs or you can navigate to the "More Data" page to view all the data for all the countries.
On the [More-Data](./pages/More-Data.js) page you are able to filter the countries by the following criteria:
- alphabeticaly
- covid cases (highest/lowest)
- covid deaths (highest/lowest)
- infection rate (highest/lowest) 
or you may search by name.


## Technacal Details
Since this is a Next.JS app, the data is first fetched using the `getStaticProps()` function. This function is called when the page is first loaded to fetch the data. It then returns the fetched data as an array of objects which is passed as a prop to the component which renders the homepage text. For the "More Data" pages the link is first parsed by the `getStaticPaths()` function which parses the URL to get the country's unique identifier. This identifier is then returned and another `getStaticProps()` function is called which uses that ID to fetch the countries data. The date is detirmined by the `getDate()` function which pulls todays date, goes back one day and then returns that date (this is because the API's most recent data is only available for the previous day). 