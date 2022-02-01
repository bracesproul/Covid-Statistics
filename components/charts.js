import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import dataHistory from './covid_data_history.json'


const TestChart = ({ dataHistory }) => {
    
    const country_ISO = Object.keys(data[0])[0];
    const country_name = data[0][country_ISO].country
    let backup_data_array = [];
    let dateArrays = [];
    let dateNums = [];
    let highestDate = 0;
    let highestDateFormatted;

    if (!dataHistory && !backup_data_array) {
        console.log('no data found');
        return <></>
    }
    let ChartData = [];
    if (dataHistory) {
        ChartData = dataHistory.map(it => {
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
    } else if (backup_data_array) {
        backupData.map(item => {
            const backup_data_key = Object.keys(item)[0];
            item[backup_data_key].map(itemV => {
                if (itemV.location == country_name) {
                    backup_data_array.push(itemV)
                    const date = itemV.date;
                    let dateInNum = date.split('-').join('');
                    dateInNum = Number(dateInNum)
                    dateArrays.push(date);
                    dateNums.push(dateInNum);
                    
                }
                
            })
        })
        const sortDates = (dates) => {
            for (let i = 0; i < dates.length; i++) {
                if (dates[i] > highestDate) {
                    highestDate = dates[i];
                    highestDateFormatted = dateArrays[i];
                }
            }
        }
        sortDates(dateNums)
        ChartData = backup_data_array.map(it => {
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
        });
    }
    console.log(ChartData);
    return (
        <div className="charts-container">
            <div className="chart">
            <h1 className="country-title">Cases*</h1>
            <OutdatedChart nameOfData="Cases" dataDate={data[0].date} currentDate={currentDate()} />
            <ResponsiveContainer width="700px" height="500px">
                <AreaChart data={ChartData}
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
            <ResponsiveContainer width="700px" height="500px">
                <AreaChart data={ChartData}
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





/*
const TestChart = ({ data, dataHistory, backupData }) => {
    
    const country_ISO = Object.keys(data[0])[0];
    const country_name = data[0][country_ISO].country
    let backup_data_array = [];
    let dateArrays = [];
    let dateNums = [];
    let highestDate = 0;
    let highestDateFormatted;

    if (!dataHistory && !backup_data_array) {
        console.log('no data found');
        return <></>
    }
    let ChartData = [];
    if (dataHistory) {
        ChartData = dataHistory.map(it => {
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
    } else if (backup_data_array) {
        backupData.map(item => {
            const backup_data_key = Object.keys(item)[0];
            item[backup_data_key].map(itemV => {
                if (itemV.location == country_name) {
                    backup_data_array.push(itemV)
                    const date = itemV.date;
                    let dateInNum = date.split('-').join('');
                    dateInNum = Number(dateInNum)
                    dateArrays.push(date);
                    dateNums.push(dateInNum);
                    
                }
                
            })
        })
        const sortDates = (dates) => {
            for (let i = 0; i < dates.length; i++) {
                if (dates[i] > highestDate) {
                    highestDate = dates[i];
                    highestDateFormatted = dateArrays[i];
                }
            }
        }
        sortDates(dateNums)
        ChartData = backup_data_array.map(it => {
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
        });
    }
    console.log(ChartData);
    return (
        <div className="charts-container">
            <div className="chart">
            <h1 className="country-title">Cases*</h1>
            <OutdatedChart nameOfData="Cases" dataDate={data[0].date} currentDate={currentDate()} />
            <ResponsiveContainer width="700px" height="500px">
                <AreaChart data={ChartData}
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
            <ResponsiveContainer width="700px" height="500px">
                <AreaChart data={ChartData}
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
*/