import { HeaderBar } from '../components/header.js';
import axios from 'axios';
import Link from 'next/link'
import { useState } from 'react';
import iso_and_country_list from '../components/iso_and_country_list';

export default function Home({ data }) {
    return (
        <div className="background-more-countries">
            <HeaderBar />
            <AllCountries countryList={data}/>
        </div>
    )
}

export const getStaticProps = async () => {
    let data = iso_and_country_list

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
            if (countryList[i].country.toLowerCase().includes(e.target.value.toLowerCase())) {
                searchListTemp.push(countryList[i]);
                setSearchList(searchListTemp);
            }
        }
        // console.log(searchList);
    }

    const fullList = countryList.map((country, index) => {
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.country}</Link></p>
        )
    })

    const filteredList = searchList.map((country, index) => {
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.country}</Link></p>
        )
    })

    return (
        <div className="country-list">
            <h1 className="contentTitle" >Countries / Datasets</h1>
            <label className="searchLabel">Search</label> <br />
            <input className="searchBox" type="search" id="search" onChange={e => handleSearchInput(e)} />
            <div className="country-list">
                {search.length > 0 ? filteredList : fullList}
            </div>
        </div>
    )
}