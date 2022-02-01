import data_history from './covid_data_history.json';

export const readData = (iso) => {
    let data;
    data_history.map(item => {
        if (Object.keys(item)[0] == iso) {
            data = item[iso];
        }
    })
    return data;
}

const readDataCountryName = (country) => {
    let data;
    data_history.map(item => {
        if (Object.keys(item)[0] == country) {
            data = item[country];
        }
    })
    return data;
}

// Bonaire Sint Eustatius and Saba / BES
// British Virgin Islands / VGB
// Cape Verde / CPV
// Cook Islands / COK
// Democratic Republic of Congo / COD
// Falkland Islands / FLK
// French Polynesia / PYF
// Hong Kong / HKG
// Micronesia (country) / FSM
// Isle of Man / IMN
// New Caledonia / NCL
// Saint Helena / SHN
// Saint Pierre and Miquelon / SPM
// South Korea / KOR
// Turks and Caicos Islands / TCA
// Wallis and Futuna / WLF
// Faeroe Islands / FRO