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
// 
export default function Home({ data }) {
  return (
    <div className="background">
        <HeaderBar />
        <ActiveCases data={data} />
    </div>
  )
}

export const getDateForRequest = () => {
    const currentDate = new Date();
    const date = new Date(currentDate - (5 * 60 * 60 * 1000));
    // console.log('date -', date)
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
    const popularCountries = ["Netherlands", "Poland", "Canada", "Portugal", "Russia", "Malaysia", "Switzerland", "Greece", "Austria", "Japan", "United Kingdom", "Thailand", "Germany", "Mexico", "Turkey", "Italy", "China", "US", "Spain", "France"]
    let countryData = [];
    let dataV = [];
    const date = getDateForRequest();
    const promise1 = popularCountries.map(async country => {
        const options = {
            method: 'GET',
            url: 'https://covid-19-statistics.p.rapidapi.com/reports',
            params: {
              region_name: country,
              date: date
            },
            headers: {
              'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
              'x-rapidapi-key': process.env.RAPID_API_KEY
            }
        };
        await axios.request(options)
        .then(response => {
            if (!response.data) {
                console.log('no data - .data')
                return;
            } 
            if (!response.data.data) {
                console.log('no data - data.data')
                return;
            }
            if (response.data.data.length == 0 ) {
                console.log('no data - length 0');
                return;
            }
            const data = response.data.data;
            const country_name = data[0].region.name;
            const date = data[0].date;
            const iso = data[0].region.iso;
            let cases = 0;
            let deaths = 0;
            data.map(item => {
                cases += item.confirmed;
                deaths += item.deaths;
            })
            countryData.push({
                "country_name": country_name,
                "date": date,
                "cases": cases,
                "deaths": deaths,
                "iso": iso
            })
        })
        .catch((error) => {
            console.error("error - ", error);
        });
        return countryData;
    })
    const returnedData = await Promise.all(promise1);
    const data = returnedData[0];

    return {
        props: { data },
        revalidate: 43200
    }
}

function ActiveCases({ data }) {
    const addComma = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
      <div>
          <h1 className={styles.Header}>Active Cases</h1>
          <section className={styles.cardList2}>
            { data.map((item, index) => {
                return (
                    <article className={styles.Card2} key={index}>
                        <header>
                            <p><strong>{item.country_name}</strong></p>
                            <p>Cases: <strong className={styles.cases}>{addComma(item.cases)}</strong></p>
                            <p>Deaths: <strong className={styles.deaths}>{addComma(item.deaths)}</strong></p>
                            <p><strong>{item.date}</strong></p>
                            <p style={{ textDecoration: "underline" }} className={styles.LinkStyle}><Link href={{pathname: `/${item.iso}`}}>Get more data</Link></p>
                        </header>
                    </article>
                )
            }) }
          </section>
      </div>
  )
}


const About = () => {
    return (
        <div>
            <h1>About this site</h1>
            <p>This site was developed to give users a seamless and interactive way to view COVID-19 data from 200+ countries around the world. 
                It updates twice a day and always has reliable data, as it's being pulled from Johns Hopkins. 
            </p>
        </div>
    )
}

