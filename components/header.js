import Link from 'next/link'
import history from './covid_data_history.json';

export const HeaderBar = () => {
    return (
      <div className="HeaderBar">
        <h4 className="HeaderItem"><Link href={{ pathname: `/` }}>Home</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/More-Countries` }}>More Countries</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/About` }}>About</Link></h4>
      </div>
    )
}

export const findEuro = (country_name) => {
  let toBeReturned;
  history.map(d => {
      const iso = Object.keys(d)[0]
      
      const country = d[iso][0].location;
      if (country == country_name) {
          toBeReturned = d[iso];
      }
  })
  return toBeReturned;
}

