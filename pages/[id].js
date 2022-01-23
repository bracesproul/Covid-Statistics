import { useRouter } from 'next/router'
import axios from 'axios';
import { HeaderBar } from './components/header';
import { getDateForRequest } from './index.js';

export default function Home({ dataStructure }) {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading...</div>
      }

    return (
        <div className="background">
            <HeaderBar />
            <div className="card-container">
                <CountryData data={dataStructure} />
            </div>
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
            <p>Fatality Rate: <strong>{(covidData.deaths / covidData.cases) * 100}</strong></p>
            <p>Last Update: <strong>{covidData.date}</strong></p>
        </article>
    )
}