import React, { useState, useEffect } from 'react';

export default function Home() {
  return (
    <div>
      <h1>Covid Stats</h1>
      <hr />
      <GetWorldwideData />
    </div>
  )
}


const GetWorldwideData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true')
    .then(response => response.json())
    .then(data => data.map((data) => {
      setData((prev) => 
      [...prev, 
        {
        country: data.country,
        infected: data.infected,
        deceased: data.deceased
        }
      ])
    }))
  }, []);

  const DisplayData = () => {
    return (
      <div>
        {data.map((data) => {
          return (
            <div>
              <p>{data.country}</p>
              <p>{data.infected}</p>
              <p>{data.deceased}</p>
              <hr />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <DisplayData />
    </>
  )
}


