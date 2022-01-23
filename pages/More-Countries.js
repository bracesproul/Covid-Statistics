import { HeaderBar } from './components/header.js';
import axios from 'axios';
import Link from 'next/link'
import { useState } from 'react';

export default function Home({ data }) {
    return (
        <div className="background-more-countries">
            <HeaderBar />
            <AllCountries countryList={data}/>
        </div>
    )
}

export const getStaticProps = async () => {
    let countries = [];
    const options = {
        method: 'GET',
        url: 'https://covid-19-statistics.p.rapidapi.com/regions',
        headers: {
          'x-rapidapi-host': 'covid-19-statistics.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    }

    const promise1 = await axios.request(options)
        .then(response => {
            response.data.data.map((country) => {
                countries.push({ name: country.name, iso: country.iso });
            });
        })
        .then(() => {
            return countries;
        })
        .catch(error => {
            console.error(error);
        });

    const data = await Promise.all(promise1)

    return { props: { data } }
}

const AllCountries = ({ countryList }) => {
    const [search, setSearch] = useState('');
    const [searchList, setSearchList] = useState([]);
    let searchListTemp = [];

    const handleSearchInput = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
        if (!e.target.value.length > 0) setSearchList([]);
        for (let i = 0; i < countryList.length; i++) {
            if (countryList[i].name.toLowerCase().includes(e.target.value.toLowerCase())) {
                searchListTemp.push(countryList[i]);
                setSearchList(searchListTemp);
            }
        }
        console.log(searchList);
    }

    const fullList = countryList.map((country, index) => {
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.name}</Link></p>
        )
    })

    const filteredList = searchList.map((country, index) => {
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.name}</Link></p>
        )
    })

    return (
        <div className="country-list">
            <h1 className="contentTitle" >Countries</h1>
            <label className="searchLabel">Search</label> <br />
            <input className="searchBox" type="search" id="search" onChange={e => handleSearchInput(e)} />
            <div className="country-list">
                {search.length > 0 ? filteredList : fullList}
            </div>
        </div>
    )
}