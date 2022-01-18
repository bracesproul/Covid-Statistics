import styles from '../styles/Home.module.css';
import Link from 'next/link'
import { HeaderBar } from './components/header';
import axios from 'axios';
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics();

export default function Home({ data }) {
  return (
    <div className={styles.Home}>
      <HeaderBar />
      <ActiveCases data={data} />
    </div>
  )
}

export const getDate = () => {
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
            date: dateForOptions
            },
            headers: {
            'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
            }
        };

        let dataV;
        await axios.request(options).then(response => {
            dataV = response.data.data;
        }).catch(error => {
            console.log('error')
            return;
        });

        let region;
        if (dataV === undefined) region = item.name;
        if (dataV?.region === undefined) region = item.name;
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
      },
      revalidate: 10800
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
                        <p>Data from {item.dataStructure.date}</p>
                        <p className={styles.LinkStyle}><Link href={{pathname: `/${item.dataStructure.iso}`}}>Get more data</Link></p>
                    </span>
                )
            }) }
          </div>
      </div>
  )
}

