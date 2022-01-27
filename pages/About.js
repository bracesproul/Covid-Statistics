import { HeaderBar } from './components/header.js';
import Link from 'next/link'

export default function Home() {
    return (
        <div className="background">
            <HeaderBar />
            <Credits />
        </div>
    )
}

const Credits = () => {
    return (
        <div className="Credits">
            <h3 className="titleStyle">Credits</h3>
            <p className="text" >This web app was developed by Brace Sproul</p>
            <p className="link" ><Link href="https://github.com/bracesproul/Covid-Statistics#readme" about="_blank">A full explanation on the web app's technologies and how it works can be found here</Link></p>
            <p className="link"><Link href="https://github.com/bracesproul" about="_blank">My GitHub</Link></p>
            <p className="link"><Link href="https://www.linkedin.com/in/brace-sproul-16a185195/" about="_blank">My LinkedIn</Link></p>
            <p className="link"><Link href="https://twitter.com/bracesproul" about="_blank">My Twitter</Link></p>
        </div>
    )
}