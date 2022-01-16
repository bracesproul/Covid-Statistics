import styles from '../styles/Home.module.css';
import Link from 'next/link'
import { HeaderBar } from './components/header';
const axios = require('axios');

export default function Home({ data }) {
  return (
    <div className={styles.Home}>
      <HeaderBar />
      <ActiveCases data={data} />
    </div>
  )
}

const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const day = () => {
        if (date.getDate().toString() === "1" && month - 1 === (2 || 4 || 6 || 9 || 11)) {
            return 30; 
        } else if (date.getDate().toString() === "1" && month - 1 === (1 || 3 || 5 || 7 || 8 || 10 || 12)) {
            return 31;
        } else {
            return date.getDate() - 1
        }
    }
    const month = () => {
        if (date.getMonth() <= 9) {
            return `0${date.getMonth() + 1}`
        } else return date.getMonth() + 1
    }
    return `${year}-${month()}-${day()}`
}

export const getStaticProps = async () => {
    const dateForOptions = getDate();
    const options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/regions',
        headers: {
            'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
            'x-rapidapi-key': "0a0ac6083dmshd4b9d1a80ab8e97p1c323ejsn671ecebffd29"
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
            date: dateForOptions
            },
            headers: {
            'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
            'x-rapidapi-key': "0a0ac6083dmshd4b9d1a80ab8e97p1c323ejsn671ecebffd29"
            }
        };

        const result = await axios.request(options);
        const dataV = result.data.data;
        let region;

        if (dataV[0]?.region === undefined) {
        region = item.name;
        } else {
        region = dataV[0].region;
        }

        if (dataV[0] === undefined) return;

        let confirmed = { "confirmed": 0 };
        let deaths = { "deaths": 0 };
        let recovered = { "recovered": 0 };
        let active = { "active": 0 };
        let fatality_rate;

        dataV.map(item => {
            confirmed = { "confirmed": item.confirmed + confirmed.confirmed }
            deaths = { "deaths": item.deaths + deaths.deaths }
            recovered = { "recovered": item.recovered + recovered.recovered }
            active = { "active": item.active + active.active }
            const getFatalityRate = () => {
                let rateV = (deaths.deaths / confirmed.confirmed) * 100;
                const rate = { "fatality_rate": rateV }
                return rate;
            }
            fatality_rate = getFatalityRate();
        })

        const dataStructure = {
        "country_name": item.name,
        "cases": confirmed.confirmed,
        "deaths": deaths.deaths,
        "recovered": recovered.recovered,
        "active": active.active,
        "fatality_rate": fatality_rate.fatality_rate,
        "date": dataV[0].date,
        "last_update": dataV[0].last_update,
        "region": region,
        "iso": item.iso
        }
        
        /* console.log(`Country: ${dataStructure.country_name}
    Confirmed: ${dataStructure.cases}
    `); */

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
    const addComma = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  return (
      <div>
          <h1 className={styles.Header}>Active Cases</h1>
          <div>
            { data.map((item, index) => {
                return (
                    <span className={styles.DataWrapper} key={index}>
                        <p>Country: {item.dataStructure.country_name} </p>
                        <p>Cases: {addComma(item.dataStructure.cases)}</p>
                        <p>Deaths: {addComma(item.dataStructure.deaths)}</p>
                        <p>Data from {item.dataStructure.last_update}</p>
                        <p className={styles.LinkStyle}><Link href={{pathname: `/${item.dataStructure.iso}`}}>Get more data</Link></p>
                    </span>
                )
            }) }
          </div>
      </div>
  )
}

