import { AreaChart, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from 'recharts';

export const Chart = ({ dataHistory, globalQuerryId }) => {

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