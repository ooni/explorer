import React from 'react'
import Package from '../package'

import { Flex } from 'reflexbox'
import inlineCSS from '../styles/main.scss'

import Link from 'next/link'
import Head from 'next/head'

export default class extends React.Component {
  render() {
    let stylesheet
    if (process.env.NODE_ENV === 'production') {
      let pathToCSS = '/assets/' + Package.version + '/main.css'
      stylesheet = <link rel="stylesheet" type="text/css" href={pathToCSS}/>
    } else {
      stylesheet = <style dangerouslySetInnerHTML={{__html: inlineCSS}}/>
    }
    return (
      <header>
        <Head>
          <meta charset='utf-8'/>
          <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
          {stylesheet}
        </Head>
        <div className='main-nav'>
          <ul>
            <li>
              <Link href='/world'><a>World</a></Link>
            </li>
            <li>
              <Link href='/explorer'><a>Explorer</a></Link>
            </li>
            <li>
              <Link href='/highlights'><a>Highlights</a></Link>
            </li>
            <li>
              <Link href='/about'><a>About</a></Link>
            </li>
          </ul>
        </div>
        <style jsx>{`
        .main-nav {
          background-color: #0588CB;
        }
        ul {
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          list-style: none;
        }
        a {
          padding: 1.25rem 0.5rem;
          margin-right: 10px;
          margin-top: 10px;
          margin-bottom: 10px;
          font-size: 1.6rem;
          font-weight: bold;
          text-decoration: none;
          display: flex;
          align-items: flex-start;
          color: #fff;
          border-radius: 10px;
        }
        a:hover, a:focus {
          color: #0588CB;
          background-color: #fff;
        }
        `}</style>
      </header>
    )
  }
}
