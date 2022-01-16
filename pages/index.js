import styles from '../styles/Home.module.css';
import Link from 'next/link'
const axios = require('axios');

export default function Home({ data }) {
  return (
    <div className={styles.Home}>
      <HeaderBar />
      <ActiveCases data={data} />
    </div>
  )
}

export const getStaticProps = async () => {
  const options = {
      method: 'GET',
      url: 'https://covid-19-statistics.p.rapidapi.com/regions',
      headers: {
        'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_API_KEY
      }
  };
  const result = await axios.request(options);
  const dataFromResult = result.data.data;
  let data = [];

  await Promise.all(dataFromResult.map(async (item, index) => {
      const options = {
              method: 'GET',
              url: 'https://covid-19-statistics.p.rapidapi.com/reports',
              params: {
                iso: item.iso,
                region_name: item.name,
                date: '2022-01-14'
              },
              headers: {
                'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
                'x-rapidapi-key': process.env.RAPID_API_KEY
              }
            };
  
          const result = await axios.request(options);
          const dataV = result.data.data[0];
          let region;
  
          if (dataV?.region === undefined) {
              region = item.name;
          } else {
              region = dataV.region;
          }
  
          if (dataV === undefined) return;
  
          const dataStructure = {
              "country_name": item.name,
              "cases": dataV.confirmed,
              "deaths": dataV.deaths,
              "recovered": dataV.recovered,
              "active": dataV.active,
              "fatality_rate": dataV.fatality_rate,
              "date": dataV.date,
              "last_update": dataV.last_update,
              "region": region
          }
          
          data = [
              ...data,
              { dataStructure }
          ]
  }));


  return {
      props: { 
          data,
      }
  }

}

function ActiveCases({ data }) {
  console.log('inside active cases')
  return (
      <div className={styles.AllData}>
          <h1 className={styles.Header}>Active Cases</h1>
          <div>
            { data.map((item, index) => {
                return (
                    <span className={styles.DataWrapper} key={index}>
                        <p>Country: {item.dataStructure.country_name} </p>
                        <p>Cases: {item.dataStructure.cases}</p>
                        <p>Deaths: {item.dataStructure.deaths}</p>
                        <p>Data from {item.dataStructure.last_update}</p>
                        <p className={styles.LinkStyle}><Link href={{pathname: `/${item.dataStructure.country_name}`}}>Get more data</Link></p>
                    </span>
                )
            }) }
          </div>
      </div>
  )
}

const HeaderBar = () => {

  return (
    <div className={styles.HeaderBar}>
      <h4 className={styles.HeaderItem}><Link href={{pathname: `/About`}}>About</Link></h4>
      <h4 className={styles.HeaderItem}><Link href={{pathname: `/More-Data`}}>More Data</Link></h4>
      <h4 className={styles.HeaderItem}><Link href={{pathname: `/Developer-Credits`}}>{"Developer & Credits"}</Link></h4>
    </div>
  )
}

