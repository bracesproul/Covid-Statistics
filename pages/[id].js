import { useRouter } from 'next/router'
import axios from 'axios';
import { HeaderBar } from './components/header';
import { readData } from './components/readDataHistory';
import { getDateForRequest } from './index.js';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';


export default function Home({ dataStructure }) {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    const dataHistory = readData(router.query.id);
    return (
        <div className="background">
            <HeaderBar />
            <div className="card-container">
                <CountryData data={dataStructure} />
            </div>
            <TestChart dataHistory={dataHistory} />
        </div>
    )
}

export const getStaticPaths = async () => {
    const options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/regions',
        headers: {
          'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };
    const result = await axios.request(options);
    const data = result.data.data;
    const paths = data.map(item => ({
        params: { id: item.iso }
    }));

    return { paths, fallback: false }
}

export const getStaticProps = async ({ params }) => {
    const id = params.id;
    // let dataOthers = { "null": "null" };
    // if ( id === "Others" || "cruise" ) return { props: { dataOthers } }
    const options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/reports',
        params: {
            iso: id,
            date: getDateForRequest()
        },
        headers: {
            'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };

    let dataStructure = {
        "country_name": "",
        "iso": "",
        "cases": 0,
        "deaths": 0,
        "recovered": 0,
        "active": 0,
        "fatality_rate": 0,
        "date": 0,
        "last_update": 0
    }
    let result;
    let dataV;

    await axios.request(options)
    .then(response => {
        result = response.data.data;
        dataV = response.data.data[0];
    })
    .catch((err) => {
        console.log(err);
    });
    // const dataFromResult = result.data;
    // console.log(dataFromResult)
    //const dataV = result.data.data[0];

    await Promise.all(result.map(async (item, index) => {
        let region;

        if (dataV?.region === undefined) {
            region = item.name;
        } else {
            region = dataV.region;
        }
        if (dataV === undefined) return;

        dataStructure = {
            "country_name": item.name,
            "cases": item.confirmed + dataStructure.cases,
            "deaths": item.deaths + dataStructure.deaths,
            "recovered": item.recovered + dataStructure.recovered,
            "active": item.active + dataStructure.active,
            "date": item.date,
            "last_update": item.last_update,
            "fatality_rate": (dataStructure.deaths / dataStructure.cases) * 100,
            "country_name": dataV.region.name,
            "iso": dataV.region.iso
        }
    }))
    .then(() => {
        dataStructure = [
            {...dataStructure}
        ]
        // console.log(dataStructure);
    });

    return {
        props: { dataStructure },
        revalidate: 43200
    }
}


const CountryData = ({ data }) => {
    let covidData = data[0];
    const addComma = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return (
        <article className="card">
            <p className="country-title">{covidData.country_name}</p>
            <p>Cases: <strong className="cases">{addComma(covidData.cases)}</strong></p>
            <p>Deaths: <strong className="deaths">{addComma(covidData.deaths)}</strong></p>
            <p>Fatality Rate: <strong>{(covidData.deaths / covidData.cases) * 100}%</strong></p>
            <p>Last Update: <strong>{covidData.date}</strong></p>
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

    if (!dataHistory) return <div>No Data</div>

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