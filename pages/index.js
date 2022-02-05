import styles from '../styles/Home.module.css';
import Link from 'next/link'
import { HeaderBar } from '../components/header';
import { OutDatedValue } from '../components/outDatedValue';
import axios from 'axios';
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { CreditsTag } from '../components/CreditsTag';
import { useState } from 'react';
import { readData } from '../components/readDataHistory';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';
import { Chart } from '../components/Chart';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

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
    const dataHistory = readData("OWID_WRL")
  return (
      <>
      <BrowserView>
        <div className="background">
            <HeaderBar />
            <ActiveCases data={data} />
            <FinalChart dataHistory={dataHistory} />
            <CreditsTag />
        </div>
        </BrowserView>
        <MobileView>
        <h1>This is rendered only on mobile</h1>
        </MobileView>
      </>
  )
}

export const getDateForRequest = () => {
    const currentDate = new Date();
    const date = new Date(currentDate - (5 * 60 * 60 * 1000));
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

const currentDate = () => {
    const newDate = new Date();
    const year = newDate.getFullYear();
    const month = newDate.toLocaleString('default', { month: 'long' });
    const day = () => {
        if (newDate.getDate().toString() === "1" && month - 1 === (2 || 4 || 6 || 9 || 11)) {
            return 30; 
        } else if (newDate.getDate().toString() === "1" && month - 1 === (1 || 3 || 5 || 7 || 8 || 10 || 12)) {
            return 31;
        } else {
            return newDate.getDate() - 1
        }
    }
    const toBeReturned = `${month} ${day()}, ${year}`;
    return toBeReturned;
}

export const getStaticProps = async () => {
    const popularCountries = ["Canada", "Russia", "India", "Brazil", "Switzerland", "Japan", "United Kingdom", "Germany", "Mexico", "Italy", "China", "United States", "Spain", "France"]
    const dataSet = [{
        "Brazil": {},
        "Canada": {},
        "China": {},
        "France": {},
        "Germany": {},
        "India": {},
        "Italy": {},
        "Japan": {},
        "Mexico": {},
        "Russia": {},
        "Spain": {},
        "Switzerland": {},
        "United Kingdom": {},
        "United States": {}
      }];
    const requestedData = new Promise(async (res, rej) => {
        await axios({
            method: 'get',
            url: 'https://api.covidstatistics.co/api/routes/data',
        })
        .then(async res => {
            await res.data[0].total_cases.map(data => {
                popularCountries.map(country => {
                    if (data.country === country)  {
                        dataSet[0][country].total_cases = data.total_cases;
                        dataSet[0][country].iso = data.iso;
                        dataSet[0][country].date = data.date;
                        dataSet[0][country].country = data.country;
                    }
                })
            });;
            await res.data[1].total_deaths.map(data => {
                popularCountries.map(country => {
                    if (data.country === country)  {
                        dataSet[0][country].total_deaths = data.total_deaths;
                    }
                })
            });
            await res.data[4].daily_cases.map(data => {
                popularCountries.map(country => {
                    if (data.country === country)  {
                        dataSet[0][country].daily_cases = data.cases;
                    }
                })
            });
            await res.data[5].daily_deaths.map(data => {
                popularCountries.map(country => {
                    if (data.country === country)  {
                        dataSet[0][country].daily_deaths = data.deaths;
                    }
                })
            });
        });
        dataSet.map(data => {
            popularCountries.map(country => {
                let total_cases = data[country].total_cases;
                let total_deaths = data[country].total_deaths;
                if (total_cases.includes("million")) {
                    total_cases = Number((total_cases.split(" million")[0] * 1000000));
                } else {
                    total_cases = Number(total_cases.split(",").join(""));
                }
                if (total_deaths.includes("million")) {
                    total_deaths = Number((total_deaths.split(" million")[0] * 1000000));
                } else {
                    total_deaths = Number(total_deaths.split(",").join(""));
                }
                const rate = (((total_deaths / total_cases) * 100).toFixed(2) + "%");
                data[country].fatality_rate = rate;

            });
        })
        res(dataSet);
    })
    const data = await requestedData;

    return {
        props: { data },
        revalidate: 86400
    }
}
function ActiveCases({ data }) {
    if (!data) return null;
    const popularCountries = ["Canada", "Russia", "India", "Brazil", "Switzerland", "Japan", "United Kingdom", "Germany", "Mexico", "Italy", "China", "United States", "Spain", "France"]
    const finalReturn = popularCountries.map(country => {
        const toReturn = data.map((data, index) => {
            if (data[country].country === country) {
                return (
                    <article className={styles.Card2} key={index}>
                        <header>
                            <p><strong>{data[country].country}</strong></p>
                            {data[country].total_cases.includes(', 2020') || data[country].total_cases.includes(', 2021') || data[country].total_cases.includes(', 2022') ? 
                            <OutDatedValue nameOfData="Total Cases" data={data[country].total_cases} dataDate={data[country].total_cases} currentDate={currentDate()} /> : 
                            <p>Total Cases: <strong className={styles.cases}>{data[country].total_cases}</strong></p>}

                            {data[country].total_deaths.includes(', 2020') || data[country].total_deaths.includes(', 2021') || data[country].total_deaths.includes(', 2022') ? 
                            <OutDatedValue nameOfData="Total Deaths" data={data[country].total_deaths} dataDate={data[country].total_deaths} currentDate={currentDate()} /> : 
                            <p>Total Deaths: <strong className={styles.deaths}>{data[country].total_deaths}</strong></p>}

                            {data[country].daily_cases.includes(', 2020') || data[country].daily_cases.includes(', 2021') || data[country].daily_cases.includes(', 2022') ? 
                            <OutDatedValue nameOfData="Daily Cases" data={data[country].daily_cases} dataDate={data[country].daily_cases} currentDate={currentDate()} /> : 
                            <p>Daily Cases: <strong className={styles.cases}>{data[country].daily_cases}</strong></p>}

                            {data[country].daily_deaths.includes(', 2020') || data[country].daily_deaths.includes(', 2021') || data[country].daily_deaths.includes(', 2022') ? 
                            <OutDatedValue nameOfData="Daily Deaths" data={data[country].daily_deaths} dataDate={data[country].daily_deaths} currentDate={currentDate()} /> : 
                            <p>Daily Deaths: <strong className={styles.deaths}>{data[country].daily_deaths}</strong></p>}

                            {data[country].fatality_rate.includes(', 2020') || data[country].fatality_rate.includes(', 2021') || data[country].fatality_rate.includes(', 2022') ? 
                            <OutDatedValue nameOfData="Fatality Rate" data={data[country].fatality_rate} dataDate={data[country].fatality_rate} currentDate={currentDate()} /> : 
                            <p>Fatality Rate: <strong className={styles.deaths}>{data[country].fatality_rate}</strong></p>}
                            <p><strong>{data[country].date}</strong></p>
                            <p style={{ textDecoration: "underline" }} className={styles.LinkStyle}><Link href={{pathname: `/${data[country].iso}`}}>Get more data</Link></p>
                        </header>
                    </article>
                )
            }
        })
        return toReturn;
    })
    return (
        <div>
            <h1 className={styles.Header}>Active Cases</h1>
            <section className={styles.cardList2}>
                {finalReturn}
            </section>
      </div>
  )
}


const FinalChart = ({ dataHistory }) => {
    return (
        <>
        <h1 className={styles.Header} >Worldwide Data</h1>
        <Chart dataHistory={dataHistory} globalQuerryId="OWID_WRL" />
        </>
    )
}