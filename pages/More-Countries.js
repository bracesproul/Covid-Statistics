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
    const speicalDatasetISOList = [
        { iso: "OWID_WRL", country: "World" }, 
        { iso: "OWID_OCE", country: "Oceania" },
        { iso: "OWID_SAM", country: "South America" },
        { iso: "OWID_UMC", country: "Upper Middle Income" },
        { iso: "OWID_NAM", country: "North America" },
        { iso: "OWID_LMC", country: "Lower Middle Income" },
        { iso: "OWID_LIC", country: "Low Income" },
        { iso: "OWID_HIC", country: "High Income" },
        { iso: "OWID_INT", country: "International" },
        { iso: "OWID_EUN", country: "European Union" },
        { iso: "OWID_EUR", country: "Europe" },
        { iso: "OWID_ASI", country: "Asia" }, 
        { iso: "OWID_AFR", country: "Africa" },
        { iso: "USA", country: "United States" }
    ];

    const speicalListChecker = [
        "European Union",
        "International",
        "High income",
        "Low income",
        "Europe",
        "Lower middle income",
        "North America",
        "South America",
        "Oceania",
        "Upper middle income", 
        "Africa", 
        "Asia", 
        "World"
    ];

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
    }

    const fullList = countryList.map((country, index) => {
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.country}</Link></p>
        )
    })

    const filteredList = searchList.map((country, index) => {
        if (speicalListChecker.includes(country.country)) return null;
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.country}</Link></p>
        )
    })

    const featuredList = speicalDatasetISOList.map((country, index) => {
        return (
            <p key={index} className="link" ><Link href={{pathname: `/${country.iso}`}}>{country.country}</Link></p>
        )
    })

    return (
        <div className="search-list-container">
            <h1 className="contentTitle" >Countries</h1>
            <div className="search-list-container">
                <div className="search-list-main">
                    <label className="titleStyleSearch">Search</label> <br />
                    <input className="searchBox" type="search" id="search" onChange={e => handleSearchInput(e)} />
                    {search.length > 0 ? filteredList : fullList}
                </div>
                <div className="search-list-featured">
                    <label className="titleStyleSearch">Featured Datasets</label>
                    {featuredList}
                </div>
            </div>
        </div>    
        )
}