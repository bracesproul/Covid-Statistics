import Link from 'next/link'

export const HeaderBar = () => {
    return (
      <div className="HeaderBar">
        <h4 className="HeaderItem"><Link href={{ pathname: `/` }}>Home</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/More-Countries` }}>More Countries</Link></h4>
        <h4 className="HeaderItem"><Link href={{ pathname: `/About` }}>About</Link></h4>
      </div>
    )
}