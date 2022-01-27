import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import dataHistory from './covid_data_history.json'

export default function ChartSelector() {
    const [chart, setChart] = useState('cases');

    useEffect(() => {
        // console.log('chart', chart)
    }, [chart])

    const handleClick = (e) => {
        e.preventDefault();
        setChart(e.target.name);
    }
    return (
        <div>
            <strong><p className="text-chart" ><a name="cases" onClick={e => handleClick(e)}>Cases</a></p></strong>
            <strong><p className="text-chart" ><a name="deaths" onClick={e => handleClick(e)}>Deaths</a></p></strong>
            <strong><p className="text-chart" ><a name="fatality" onClick={e => handleClick(e)}>Fatality Rate</a></p></strong>
            <div className="chart-container">
                {chart === 'cases' ? <CaseChart /> : null}
                {chart === 'deaths' ? <DeathChart /> : null}
                {chart === 'fatality' ? <FatalityChart /> : null}
            </div>
        </div>
    )
}

const CaseChart = ({ data }) => {
    const dataV = [
        { name: "2022-01-10", cases: 61558085 },
        { name: "2022-01-11", cases: 62308132 },
        { name: "2022-01-12", cases: 63203443 },
        { name: "2022-01-13", cases: 64061989 },
        { name: "2022-01-14", cases: 64917692 },
        { name: "2022-01-15", cases: 65444262 },
        { name: "2022-01-16", cases: 65699947 },
        { name: "2022-01-17", cases: 66421598 },
        { name: "2022-01-18", cases: 67589830 },
        { name: "2022-01-19", cases: 68569600 },
        { name: "2022-01-20", cases: 69308071 },
    ]
    
    return (
        <div className="chart">
            <h1 className="country-title">Cases</h1>
            <LineChart width={750} height={300} data={dataV}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="0" horizontal="false" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#8884d8" />
            </LineChart>
        </div>
    )
}

const DeathChart = ({ data }) => {
    const dataV = [
        { name: "2022-01-10", deaths: 615580 },
        { name: "2022-01-11", deaths: 623081 },
        { name: "2022-01-12", deaths: 632034 },
        { name: "2022-01-13", deaths: 640619 },
        { name: "2022-01-14", deaths: 649176 },
        { name: "2022-01-15", deaths: 654442 },
        { name: "2022-01-16", deaths: 656999 },
        { name: "2022-01-17", deaths: 664215 },
        { name: "2022-01-18", deaths: 675898 },
        { name: "2022-01-19", deaths: 685696 },
        { name: "2022-01-20", deaths: 693080 },
    ]
    
    return (
        <div className="chart">
            <h1 className="country-title">Deaths</h1>
            <LineChart width={750} height={300} data={dataV}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="deaths" stroke="#8884d8" />
            </LineChart>
        </div>
    )
}

const FatalityChart = ({ data }) => {
    const dataV = [
        { name: "2022-01-10", fatality_rate: 1.20 },
        { name: "2022-01-11", fatality_rate: 1.21 },
        { name: "2022-01-12", fatality_rate: 1.22 },
        { name: "2022-01-13", fatality_rate: 1.23 },
        { name: "2022-01-14", fatality_rate: 1.24 },
        { name: "2022-01-15", fatality_rate: 1.25 },
        { name: "2022-01-16", fatality_rate: 1.26 },
        { name: "2022-01-17", fatality_rate: 1.27 },
        { name: "2022-01-18", fatality_rate: 1.28 },
        { name: "2022-01-19", fatality_rate: 1.29 },
        { name: "2022-01-20", fatality_rate: 1.30 },
    ]
    
    return (
        <div className="chart">
            <h1 className="country-title">Fatality Rate</h1>
            <LineChart width={750} height={300} data={dataV}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="fatality_rate" stroke="#8884d8" />
            </LineChart>
        </div>
    )
}

/*
export const TestChart = ({ dataHistory }) => {
    const dataToBeUsed = dataHistory.map(item => {
        if (item.date_number > 20220101){
            console.log(item.date)
            return item
        }
    })
    const data = dataHistory.map(it => {
        let new_cases = Number(it.new_cases)
        let new_deaths = Number(it.new_deaths)
        let total_cases = Number(it.total_cases)
        let total_deaths = Number(it.total_deaths)
        return {
            new_cases: new_cases,
            new_deaths: new_deaths,
            total_cases: total_cases,
            total_deaths: total_deaths,
            date: it.date
        }
    })
    return (
        <div className="charts-container">
            <div className="chart">
            <h1 className="country-title">Cases</h1>
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
            <h1 className="country-title">Deaths</h1>
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
        </div>
    )
}
*/