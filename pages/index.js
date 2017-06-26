import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { Flex, Box } from 'reflexbox'

import { Container, Text, Stat, Button } from 'rebass'
import { Avatar } from 'rebass'

import Layout from '../components/layout'
import Globe from '../components/globe'
import NavMenu from '../components/navmenu'

import { colors } from '../components/layout'

export default class extends React.Component {
  render () {
    return (
      <Layout hideHeader>
        <Head>
          <title>OONI Explorer</title>
        </Head>
        <div className="hero">
          <Flex align="center" justify='space-around' w={1}>
            <Box p={2} w={1/2} mr='auto'>
              <div className="explorer-logo">
                <img src="/_/static/ooni-explorer-logo.svg" />
              </div>
            </Box>
            <Box p={2} w={1/2} ml='auto'>
              <NavMenu />
            </Box>
          </Flex>
          <Flex align='center' justify='space-around' width={1}>
            <Box p={2} width={1/2}>
              <div className='call-to-action'>
                <p>Uncover evidence of network tampering, near and far!</p>
                <Button
                  backgroundColor="primary"
                  color="white"
                  inverted
                  rounded>Do it!</Button>
              </div>
            </Box>
            <Box p={2} width={1/2}>
              <Globe />
            </Box>
          </Flex>
          <style jsx>{`
            .hero {
              min-height: 50vh;
              min-height: 500px;
              background-image: url("/_/static/background-pattern.png");
              background-repeat: repeat;
            }
            .explorer-logo {
            }

            .call-to-action {
              width: 400px;
            }
            .call-to-action p {
              color: ${ colors.white };
              font-size: 40px;
              font-weight: bold;
              padding-bottom: 10px;
            }
          `}</style>
        </div>
        <div className='stats-container'>
          <div className='stats'>
            <Flex
              align="center"
              justify="space-between"
              wrap
            >
              <Stat
                label="Measurements"
                unit="M"
                value="172"
              />

              <Stat
                label="Countries"
                value="192"
              />

              <Stat
                label="Networks"
                value="5029"
              />

              <Stat
                label="Confirmed cases of censorship"
                value="2120"
              />
            </Flex>
          </div>
          <style jsx>{`
            .stats-container {
              position: relative;
            }
            .stats {
              color: ${ colors.offBlack };
              background-color: ${ colors.white };
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
              padding-top: 40px;
              padding-bottom: 40px;
              padding-left: 30px;
              padding-right: 30px;
              border-radius: 25px;
              width: 900px;
              margin: 0 auto;
              position: absolute;
              left: 0;
              right: 0;
              top: -70px;
            }
          `}</style>
        </div>
        <div className='features-container'>
          <div className='features'>
          <Flex align='center' justify='space-around' width={1}>
            <Box p={2} width={1}>
              <div className='feature'>
                <div className='feature-icon'>
                  <Avatar
                    circle
                    size={64}
                    src="http://lorempixel.com/64/64/cats"/>
                </div>
                <div className='feature-title'>
                  <h2>Lorem ipsum</h2>
                </div>
                <div className='feature-text'>
                  <p>
										Panels are great for visually separating UI, content, or data from the rest of the page.
										Panels are great for visually separating UI, content, or data from the rest of the page.
										Panels are great for visually separating UI, content, or data from the rest of the page.
                  </p>
                </div>
                <div className='feature-action'>
                  <Button
                    backgroundColor="primary"
                    color="white"
                    inverted
                    rounded>Do it!</Button>
                </div>
              </div>
            </Box>
            <Box p={2} width={1/3}>
              <div className='feature'>
                <div className='feature-icon'>
                  <Avatar
                    circle
                    size={64}
                    src="http://lorempixel.com/64/64/cats"/>
                </div>
                <div className='feature-title'>
                  <h2>Explore</h2>
                </div>
                <div className='feature-text'>
                  <p>Search, filter and explore millions of network measurements collected from thousands of network vantage points all over the world.</p>
                </div>
                <div className='feature-action'>
                  <Link href='/explore'>
                  <Button
                    backgroundColor="primary"
                    color="white"
                    inverted
                    rounded>Explore</Button>
                  </Link>
                </div>
              </div>
            </Box>
            <Box p={2} width={1/3}>
              <div className='feature'>
                <div className='feature-icon'>
                  <Avatar
                    circle
                    size={64}
                    src="http://lorempixel.com/64/64/cats"/>
                </div>
                <div className='feature-title'>
                  <h2>Lorem ipsum</h2>
                </div>
                <div className='feature-text'>
                  <p>
										Panels are great for visually separating UI, content, or data from the rest of the page.
										Panels are great for visually separating UI, content, or data from the rest of the page.
										Panels are great for visually separating UI, content, or data from the rest of the page.
                  </p>
                </div>
                <div className='feature-action'>
                  <Button
                    backgroundColor="primary"
                    color="white"
                    inverted
                    rounded>Do it!</Button>
                </div>
              </div>
            </Box>
          </Flex>
          </div>
          <style jsx>{`
            .features-container {
              background: linear-gradient(#F0F4F7, ${ colors.offWhite })
            }
            .features {
              padding-top: 100px;
              padding-bottom: 30px;
            }
            .feature {
              width: 300px;
            }
            .feature-icon {
              width: 64px;
              margin: 0 auto;
            }
            .feature-title {
              text-align: center;
              padding-bottom: 20px;
            }
            .feature-text {
              padding-bottom: 20px;
            }
          `}</style>
        </div>
      </Layout>
    )
  }
}
