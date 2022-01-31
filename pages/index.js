import styles from '../styles/Home.module.css';
import Link from 'next/link'
import { HeaderBar } from '../components/header';
import { OutDatedValue } from '../components/outDatedValue';
import axios from 'axios';
import { getAnalytics, logEvent } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { useState } from 'react';

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
    const date = getDateForRequest();
    const options = {
        method: 'GET',
        url: 'https://covid-data-and-api.herokuapp.com/get-data/data',
    };
    const requestedData = new Promise(async (res, rej) => {
        let dataV = [];
        popularCountries.map(async (country, index) => {
            // get total cases 
            await axios.request(options)
            .then(res => {
                res.data[0].total_cases.map(item => {
                    if (item.country === country) {
                        // console.log(Object.keys(item)[1])
                        // console.log(item.country)
                        // console.log(item.total_cases)
                        dataV.push({[item.country]: {
                            country: item.country,
                            total_cases: item.total_cases,
                            total_deaths: 0,
                            daily_cases: 0,
                            daily_deaths: 0,
                            cumulative_fatality_rate: 0,
                            iso: item.iso,
                        }})
                    }
                })
            })
            .catch(err => {
                console.error('ERROR -', err);
            }); 
    
            // get total deaths
            await axios.request(options)
            .then(res => {
                res.data[1].total_deaths.map(item => {
                    if (item.country === country) {
                        // console.log(Object.keys(item)[1])
                        // console.log(item.country)
                        // console.log(item.total_deaths)
                        dataV.map(data => {
                            if (data[country]) {
                                // console.log('ITEM COUNTRY -', data[country].country)
                                // console.log('ITEM total deaths -', data[country].total_deaths)
                                data[country].total_deaths = item.total_deaths
                                // console.log(data[country])
                            }
                        })
                    }
                })
            })
            .catch(err => {
                console.error('ERROR -', err);
            });
    
            // get daily cases
            await axios.request(options)
            .then(res => {
                res.data[4].daily_cases.map(item => {
                    if (item.country === country) {
                        // console.log(Object.keys(item)[1])
                        // console.log(item.country)
                        // console.log(item.daily_cases)
                        dataV.map(data => {
                            if (data[country]) {
                                // console.log('ITEM COUNTRY -', data[country].country)
                                // console.log('ITEM daily cases -', data[country].daily_cases)
                                data[country].daily_cases = item.cases
                                // console.log(data[country])
                            }
                        })
                    }
                })
            })
            .catch(err => {
                console.error('ERROR -', err);
            });
            
            // get daily deaths
            await axios.request(options)
            .then(res => {
                res.data[5].daily_deaths.map(item => {
                    if (item.country === country) {
                        // console.log(Object.keys(item)[1])
                        // console.log(item.country)
                        // console.log(item.daily_deaths)
                        dataV.map(data => {
                            if (data[country]) {
                                // console.log('ITEM COUNTRY -', data[country].country)
                                // console.log('ITEM daily deaths -', data[country].daily_deaths)
                                data[country].daily_deaths = item.deaths
                                // console.log(data[country])
                            }
                        })
                    }
                })
            })
            .catch(err => {
                console.error('ERROR -', err);
            });
            
            // get cumulative fatality rate
            await axios.request(options)
            .then(res => {
                res.data[7].cumulative_fatality_rate.map(item => {
                    if (item.country === country) {
                        // console.log(Object.keys(item)[1])
                        // console.log(item.country)
                        // console.log(item.cumulative_fatality_rate)
                        dataV.map(data => {
                            if (data[country]) {
                                // console.log('ITEM COUNTRY -', data[country].country)
                                // console.log('ITEM daily cases -', data[country].cumulative_fatality_rate)
                                data[country].cumulative_fatality_rate = item.cumulative_fatality_rate
                                // console.log(data[country])
                            }
                        })
                    }
                })
            })
            .catch(err => {
                console.error('ERROR -', err);
            });
            res(dataV);
        })
        
    })

    // console.log('REQUESTED DATA - ', await requestedData);
    const data = await requestedData;

    return {
        props: { data },
        revalidate: 86400
    }
}

function ActiveCases({ data }) {
    // console.log('DATA - ', data);
    return (
        <div>
            <h1 className={styles.Header}>Active Cases</h1>
            <section className={styles.cardList2}>
                <p>DATA HERE</p>
                { data.map((item, index) => {
                const countryKey = Object.keys(item)[0];
                const dataToUse = item[countryKey];
                
                return (
                <article className={styles.Card2} key={index}>
                    <header>
                        <p><strong>{dataToUse.country}</strong></p>
                        {dataToUse.total_cases[0].includes(', 2020') || dataToUse.total_cases[0].includes(', 2021') || dataToUse.total_cases[0].includes(', 2022') ? <OutDatedValue nameOfData="Total Cases" data={dataToUse.total_cases[1]} dataDate={dataToUse.total_cases[0]} currentDate={currentDate()} /> : <p>Total Cases: <strong className={styles.cases}>{dataToUse.total_cases}</strong></p>}
                        {dataToUse.total_deaths[0].includes(', 2020') || dataToUse.total_deaths[0].includes(', 2021') || dataToUse.total_deaths[0].includes(', 2022') ? <OutDatedValue nameOfData="Total Deaths" data={dataToUse.total_deaths[1]} dataDate={dataToUse.total_deaths[0]} currentDate={currentDate()} /> : <p>Total Deaths: <strong className={styles.deaths}>{dataToUse.total_deaths}</strong></p>}
                        {dataToUse.daily_cases[0].includes(', 2020') || dataToUse.daily_cases[0].includes(', 2021') || dataToUse.daily_cases[0].includes(', 2022') ? <OutDatedValue nameOfData="New Cases" data={dataToUse.daily_cases[1]} dataDate={dataToUse.daily_cases[0]} currentDate={currentDate()} /> : <p>New Cases: <strong className={styles.cases}>{dataToUse.daily_cases}</strong></p>}
                        {dataToUse.daily_deaths[0].includes(', 2020') || dataToUse.daily_deaths[0].includes(', 2021') || dataToUse.daily_deaths[0].includes(', 2022') ? <OutDatedValue nameOfData="New Deaths" data={dataToUse.daily_deaths[1]} dataDate={dataToUse.daily_deaths[0]} currentDate={currentDate()} /> : <p>New Deaths: <strong className={styles.deaths}>{dataToUse.daily_deaths}</strong></p>}
                        <p>Fatality Rate: <strong>{dataToUse.cumulative_fatality_rate}</strong></p>
                        <p><strong>{item.date}</strong></p>
                        <p style={{ textDecoration: "underline" }} className={styles.LinkStyle}><Link href={{pathname: `/${dataToUse.iso}`}}>Get more data</Link></p>
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