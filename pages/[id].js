import { useRouter } from 'next/router'
import axios from 'axios';
import { HeaderBar } from './components/header';

export default function Home() {
    const router = useRouter()
    if (router.isFallback) {
        return <div>Loading...</div>
      }

    return (
        <div>
            <HeaderBar />
            <h1>Covid Stats</h1>
            <h3>This page will display the broken down and more in depth stats for each country, with the ability to change the date, if US you can change the state and possibly city. </h3>
            <CountryData />
        </div>
    )
}

export const getStaticPaths = async () => {
    const options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/regions',
        headers: {
          'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
          'x-rapidapi-key': '0a0ac6083dmshd4b9d1a80ab8e97p1c323ejsn671ecebffd29'
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
    let dataOthers = { "null": "null" };
    if ( id === "Others" || "cruise" ) return { props: { dataOthers } }
    const options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/reports',
        params: {
            iso: id,
            date: '2022-01-14'
        },
        headers: {
            'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
            'x-rapidapi-key': "0a0ac6083dmshd4b9d1a80ab8e97p1c323ejsn671ecebffd29"
        }
    };
    //const result = await axios.request(options);
    let data;
    axios.request(options).then(response => {
        data = response.data.data[0];
    }).catch(error => {
        console.log('error')
        return;
    });
    // setTimeout(() => {console.log(data)}, 3000);
    return {
        props: { data }
    }
}

const CountryData = ({ data }) => {
    // console.log(data)
    const router = useRouter()
    const query = router.query.id;
    // console.log(router.query);


    return (
        <>
            <p>Route: {query}</p>
            <p>Country: </p>
        </>
    )
}