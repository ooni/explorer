import { colors } from './layout'

import Link from 'next/link'

export default () => {
  return (
    <div className="nav-menu">
      <Link href='/countries'><a>Countries</a></Link>
      <Link href='/results'><a>Results</a></Link>
      <Link href='/explore'><a>Search</a></Link>
      <style jsx>{`
          .nav-menu a {
            color: ${ colors.white };
            text-decoration: none;
            text-transform: uppercase;
            padding-left: 10px;
          }
      `}</style>
    </div>
  )
}
