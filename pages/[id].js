import { useRouter } from 'next/router'
import axios from 'axios';
import data_historyV from '../components/covid_data_history.json';
import { HeaderBar } from '../components/header';
import { readData } from '../components/readDataHistory';
import { OutDatedValue, OutdatedChart } from '../components/outDatedValue';
import { currentDate } from '../components/dates';
import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';
import iso_and_country_list from '../components/iso_and_country_list';
import { CreditsTag } from '../components/CreditsTag';

let globalQuerryId;
export default function Home({ data }) {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading...</div>
    }
    globalQuerryId = router.query.id;
    const dataHistory = readData(router.query.id);
    return (
        <div className="background">
            <HeaderBar />
            <div className="card-container">
                <CountryData data={data} />
            </div>
            <TestChart dataHistory={dataHistory} />
            <CreditsTag />
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
                        dataV[0][paramId].date = item.date;
                    }
                })

                const total_deaths = await res.data[1].total_deaths.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_deaths = item.total_deaths;
                    }
                })
                
                const total_hospitalized = await res.data[2].total_hospitalized.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_hospitalized = item.current_hospitalized;
                    }
                })

                const total_icu = await res.data[3].total_icu.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].total_icu = item.current_icu;
                    }
                })

                const daily_cases = await res.data[4].daily_cases.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].daily_cases = item.cases;
                    }
                })

                const daily_deaths = await res.data[5].daily_deaths.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].daily_deaths = item.deaths;
                    }
                })

                const fatality_rate_7_day_avg = await res.data[6].fatality_rate_7_day_avg.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].fatality_rate_7_day_avg = item.death_rate_7;
                    }
                })

                const cumulative_fatality_rate = await res.data[7].cumulative_fatality_rate.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].cumulative_fatality_rate = item.cumulative_fatality_rate;
                    }
                })

                const daily_tests = await res.data[8].daily_tests.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].daily_tests = item.new_tests;
                    }
                })

                const vaccines_administered = await res.data[9].vaccines_administered.filter(item => {
                    if (item.iso === paramId) {
                        dataV[0][paramId].vaccines_administered = item.vaccines_administered;
                    }
                })

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
    const data = await requestedData;
    return {
        props: { data },
        revalidate: 86400
    }
}


const CountryData = ({ data }) => {
    const returnedData = data.map(item => {
        const countryXYZ = Object.keys(item)[0];
        return item[countryXYZ]
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
    let date = dataToUse.date;

    const DataDisplayer = ({title, data, uiClass}) => {
        if (!data) return null
        const handler = data[0].includes(', 2020') || data[0].includes(', 2021') || data[0].includes(', 2022') ?
        <OutDatedValue uiClass={uiClass} nameOfData={title} data={data[1]} dataDate={data[0]} currentDate={currentDate()} /> :
        <p>{title}: <strong className={uiClass} >{data}</strong></p>
        
        return handler;
    }
    if (!dataToUse.total_cases) {
        console.log('No data for this country');
        console.log("QUERRY -", globalQuerryId);
        return null;
    }
    return (
        <article className="card">
            <p className="country-title">{dataToUse.country}</p>
                <DataDisplayer title="Total Cases" data={total_cases} uiClass="cases" /> 
                <DataDisplayer title="Total Deaths" data={total_deaths} uiClass="deaths" />
                <DataDisplayer title="New Cases" data={daily_cases} uiClass="cases" />
                <DataDisplayer title="New Deaths" data={daily_deaths} uiClass="deaths" />
                <DataDisplayer title="Hospitalized Patients" data={total_hospitalized} uiClass="fatality-rate" />
                <DataDisplayer title="ICU Patients" data={total_icu} uiClass="fatality-rate" />
                <DataDisplayer title="Cumulative Fatality Rate" data={cumulative_fatality_rate} uiClass="deaths" />
                <DataDisplayer title="Fatality Rate (7 day avg)" data={fatality_rate_7_day_avg} uiClass="deaths" />
                <DataDisplayer title="Fully Vaccinated Population" data={fully_vaccinated_people} uiClass="good-things" />
                <DataDisplayer title="Vaccines Administered" data={vaccines_administered} uiClass="good-things" />
                <DataDisplayer title="Daily Tests" data={daily_tests} uiClass="good-things" />
                <DataDisplayer title="Date" data={date} uiClass="text" />
        </article>
    )
}



const TestChart = ({ dataHistory }) => {

    if (!dataHistory) {
        console.log("No chart data for this country");
        console.log("QUERRY -", globalQuerryId);
        return null;
    }

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
            <ResponsiveContainer width={800} height={350} >
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
            <ResponsiveContainer width={800} height={350} >
                <AreaChart data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip dataKey="date" />
                <Area type="monotone" dataKey="new_deaths" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>
    )
}

