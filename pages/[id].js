import { useRouter } from 'next/router'
import axios from 'axios';
import { HeaderBar } from '../components/header';
import { readData } from '../components/readDataHistory';
import { OutDatedValue } from '../components/outDatedValue';
import { currentDate } from '../components/dates';
import { getDateForRequest } from './index.js';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';
import iso_and_country_list from '../components/iso_and_country_list';
import { useEffect, useState } from 'react';


export default function Home({ data }) {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    const dataHistory = readData(router.query.id);
    return (
        <div className="background">
            <HeaderBar />
            <div className="card-container">
                <CountryData data={data} />
            </div>
            <TestChart dataHistory={dataHistory} />
        </div>
    )
}

export const getStaticPaths = () => {
    const paths = iso_and_country_list.map(item => ({
        params: { id: item.iso }
    }));

    return { paths, fallback: false }
}


export const getStaticProps = async ({ params }) => {
    const paramId = params.id;
    const options = {
        method: 'GET',
        url: 'https://covid-data-and-api.herokuapp.com/get-data/data',
    };
    const requestedData = new Promise(async (res, rej) => {
        let dataV = [];
        try {
            const result = await axios.request(options)
            .then(async res => {
                dataV.push({[paramId]: {
                    total_cases: '',
                    total_deaths: '',
                    total_hospitalized: '',
                    total_icu: '',
                    daily_cases: '',
                    daily_deaths: '',
                    fatality_rate_7_day_avg: '',
                    cumulative_fatality_rate: '',
                    daily_tests: '',
                    vaccines_administered: '',
                    fully_vaccinated_people: '',
                    country: '',
                    iso: '',
                    date: '',
                }})
                const total_cases = await res.data[0].total_cases.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_cases = item.total_cases;
                        dataV[0][paramId].country = item.country;
                        dataV[0][paramId].iso = item.iso;
                    }
                })

                // console.log(res.data[1]); // total_deaths
                const total_deaths = await res.data[1].total_deaths.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_deaths = item.total_deaths;
                    }
                })
                
                // console.log(res.data[2]); // total_hospitalized
                const total_hospitalized = await res.data[2].total_hospitalized.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_hospitalized = item.current_hospitalized;
                    }
                })

                // console.log(res.data[3]); // total_icu
                const total_icu = await res.data[3].total_icu.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_icu = item.current_icu;
                    }
                })

                // console.log(res.data[4]); // daily_cases
                const daily_cases = await res.data[4].daily_cases.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].daily_cases = item.cases;
                    }
                })

                // console.log(res.data[5]); // daily_deaths
                const daily_deaths = await res.data[5].daily_deaths.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].daily_deaths = item.deaths;
                    }
                })

                // console.log(res.data[6]); // fatality_rate_7_day_avg (broken)
                const fatality_rate_7_day_avg = await res.data[6].fatality_rate_7_day_avg.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].fatality_rate_7_day_avg = item.death_rate_7;
                    }
                })

                // console.log(res.data[7]); // cumulative_fatality_rate
                const cumulative_fatality_rate = await res.data[7].cumulative_fatality_rate.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].cumulative_fatality_rate = item.cumulative_fatality_rate;
                    }
                })

                // console.log(res.data[8]); // daily_tests
                const daily_tests = await res.data[8].daily_tests.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].daily_tests = item.new_tests;
                    }
                })

                // console.log(res.data[9]); // vaccines_administered
                const vaccines_administered = await res.data[9].vaccines_administered.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].vaccines_administered = item.vaccines_administered;
                    }
                })

                // console.log(res.data[10]); // fully_vaccinated_people
                const fully_vaccinated_people = await res.data[10].fully_vaccinated_people.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].fully_vaccinated_people = item.people_fully_vaccinated;
                    }
                });
            })
        } catch (error) {
            rej(error);
        }
        res(dataV);
    });
    // console.log(await requestedData);
    const data = await requestedData;
    return {
        props: { data },
        revalidate: 86400
    }
}


const CountryData = ({ data }) => {
    const returnedData = data.map(item => {
        const country = Object.keys(item)[0];
        return item[country]
    });

    const dataToUse = returnedData[0];
    let total_cases = dataToUse.total_cases;
    let total_deaths = dataToUse.total_deaths;
    let daily_cases = dataToUse.daily_cases;
    let daily_deaths = dataToUse.daily_deaths;
    let total_hospitalized = dataToUse.total_hospitalized;
    let total_icu = dataToUse.total_icu;
    let cumulative_fatality_rate = dataToUse.cumulative_fatality_rate;
    let fatality_rate_7_day_avg = dataToUse.fatality_rate_7_day_avg;
    let fully_vaccinated_people = dataToUse.fully_vaccinated_people;
    let vaccines_administered = dataToUse.vaccines_administered;
    let daily_tests = dataToUse.daily_tests;

    const DataDisplayer = ({title, data, uiClass}) => {
        if (!data) return null
        const handler = data[0].includes(', 2020') || data[0].includes(', 2021') || data[0].includes(', 2022') ?
        <OutDatedValue uiClass={uiClass} nameOfData={title} data={data[1]} dataDate={data[0]} currentDate={currentDate()} /> :
        <p>{title}: <strong className={uiClass} >{data}</strong></p>
        
        return handler;
    }

    return (
        <article className="card">
            <p className="country-title">{dataToUse.country}</p>
                <DataDisplayer title="Total Cases" data={total_cases} uiClass="cases" /> 
                <DataDisplayer title="Total Deaths" data={total_deaths} uiClass="deaths" />
                <DataDisplayer title="New Cases" data={daily_cases} uiClass="cases" />
                <DataDisplayer title="New Deaths" data={daily_deaths} uiClass="deaths" />
                <DataDisplayer title="Hospitalized Patients" data={total_hospitalized} uiClass="deaths" />
                <DataDisplayer title="ICU Patients" data={total_icu} uiClass="deaths" />
                <DataDisplayer title="Cumulative Fatality Rate" data={cumulative_fatality_rate} uiClass="deaths" />
                <DataDisplayer title="Fatality Rate (7 day avg)" data={fatality_rate_7_day_avg} uiClass="deaths" />
                <DataDisplayer title="Fully Vaccinated Population" data={fully_vaccinated_people} uiClass="deaths" />
                <DataDisplayer title="Vaccines Administered" data={vaccines_administered} uiClass="deaths" />
                <DataDisplayer title="Daily Tests" data={daily_tests} uiClass="deaths" />
            
        </article>
    )
}

const TestChart = ({ dataHistory }) => {
    //const dataToBeUsed = dataHistory.map(item => {
        //if (item.date_number > 20220101){
            //console.log(item.date)
            //return item
        //}
    //})

    if (!dataHistory) return <></>

    const data = dataHistory.map(it => {
        let new_cases = Number(it.new_cases)
        let new_deaths = Number(it.new_deaths)
        let total_cases = Number(it.total_cases)
        let total_deaths = Number(it.total_deaths)
        const dateNum = Number(it.date_number);

        const deathsArr = it.new_deaths.split(',');
        const casesArr = it.new_cases.split(',');

        if (deathsArr[0].includes('-')) {
            new_deaths = 0;
        };
        if (casesArr[0].includes('-')) {
            new_cases = 0;
        };
        return {
            new_cases: new_cases,
            new_deaths: new_deaths,
            total_cases: total_cases,
            total_deaths: total_deaths,
            date: it.date,
            date_number: dateNum
        }
    }) 
    return (
        <div className="charts-container">
            <div className="chart">
            <h1 className="country-title">Cases*</h1>
            <ResponsiveContainer width={800} height={325}>
                <AreaChart data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip dataKey="date" />
                <Area type="monotone" dataKey="new_cases" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
            <div className="chart">
            <h1 className="country-title">Deaths*</h1>
            <ResponsiveContainer width={800} height={325}>
                <AreaChart data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip dataKey="date" />
                <Area type="monotone" dataKey="new_deaths" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
            <p>*Data isn't fully up to date, most recent data displayed on graphs is from Jan 24th 2022.*</p>
        </div>
    )
}