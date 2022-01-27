import data_history from './covid_data_history.json';


export default function Home() {
    return 0;
}

export const readData = (iso) => {
    let data;
    data_history.map(item => {
        if (Object.keys(item)[0] == iso) {
            data = item[iso];
        }
    })
    // console.log(data)
    return data;
}
