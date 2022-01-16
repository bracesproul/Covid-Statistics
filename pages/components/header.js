import Link from 'next/link'

export default function Home() {
  return (
    <div></div>
  )
}

export const HeaderBar = () => {
    return (
      <div className="HeaderBar">
        <h4 className="HeaderItem"><Link href={{ pathname: `/` }}>Home</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/About` }}>About</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/More-Data` }}>More Data</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/Developer-Credits` }}>{"Developer & Credits"}</Link></h4>
      </div>
    )
}