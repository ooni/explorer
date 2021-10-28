import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  Text,
  Heading,
  Container
} from 'ooni-components'

import Layout from '../components/Layout'
import NavBar from '../components/NavBar'

const links = [
'/msmt/20211029T170344Z_webconnectivity_KH_131178_n1_nfAoW2KJTjaHoERe',
'/msmt/20211029T130445Z_webconnectivity_RU_12389_n1_iErIuiLBN7exx35v',
'/msmt/20211029T170355Z_webconnectivity_FR_3215_n1_aSNBdJr5nZyMiIKc',
'/msmt/20211029T165803Z_webconnectivity_MM_58952_n1_Vnj7KuDzQfpuYtFE',
'/msmt/20211029T170550Z_webconnectivity_GB_41230_n1_WbtSWcMUezw1TzO9',
'/msmt/20211029T130445Z_webconnectivity_RU_12389_n1_iErIuiLBN7exx35v',
'/msmt/20211029T170652Z_webconnectivity_US_6128_n1_y1ht9D7qo76oILeD',
'/msmt/20211029T170652Z_webconnectivity_US_6128_n1_y1ht9D7qo76oILeD',
'/msmt/20211029T170623Z_webconnectivity_NL_13127_n1_EofixKlHoPtC0HgI',
'/msmt/20211029T170450Z_webconnectivity_SG_8075_n1_wbqQ0JeP6zkdSOvx',
'/msmt/20211029T170230Z_webconnectivity_FI_16086_n1_wIZiOPMMvcLyxMjF',
'/msmt/20211029T170652Z_webconnectivity_US_6128_n1_y1ht9D7qo76oILeD',
'/msmt/20211029T170450Z_webconnectivity_SG_8075_n1_wbqQ0JeP6zkdSOvx',
'/msmt/20211029T130445Z_webconnectivity_RU_12389_n1_iErIuiLBN7exx35v',
'/msmt/20211029T170623Z_webconnectivity_NL_13127_n1_EofixKlHoPtC0HgI',
'/msmt/20211029T170355Z_webconnectivity_FR_3215_n1_aSNBdJr5nZyMiIKc',
'/msmt/20211029T170127Z_webconnectivity_BR_27699_n1_ecxAwh6L93SoAHwD',
'/msmt/20211029T170736Z_psiphon_SE_39351_n1_sYJihCo4Cr8gQGLL',
'/msmt/20211029T170623Z_webconnectivity_NL_13127_n1_EofixKlHoPtC0HgI',
'/msmt/20211029T170613Z_webconnectivity_ES_57269_n1_EInAEuLz87EAYjB0',
'/msmt/20211029T170344Z_webconnectivity_KH_131178_n1_nfAoW2KJTjaHoERe',
'/msmt/20211029T130445Z_webconnectivity_RU_12389_n1_iErIuiLBN7exx35v',
'/msmt/20211029T170450Z_webconnectivity_SG_8075_n1_wbqQ0JeP6zkdSOvx',
'/msmt/20211029T170355Z_webconnectivity_FR_3215_n1_aSNBdJr5nZyMiIKc',
'/msmt/20211029T170230Z_webconnectivity_FI_16086_n1_wIZiOPMMvcLyxMjF',
'/msmt/20211029T165803Z_webconnectivity_MM_58952_n1_Vnj7KuDzQfpuYtFE',
'/msmt/20211029T130445Z_webconnectivity_RU_12389_n1_iErIuiLBN7exx35v',
'/msmt/20211029T170613Z_webconnectivity_ES_57269_n1_EInAEuLz87EAYjB0',
'/msmt/20211029T170550Z_webconnectivity_GB_41230_n1_WbtSWcMUezw1TzO9',
'/msmt/20211029T155403Z_webconnectivity_ZA_36937_n1_i0mnVUpT44okty8Q',
'/msmt/20211029T170733Z_tor_DE_3209_n1_kFIa5G21K9KX3ovw',
'/msmt/20211029T170733Z_psiphon_NL_13127_n1_boAXTleaFO6LqIkU',
'/msmt/20211029T170623Z_webconnectivity_NL_13127_n1_EofixKlHoPtC0HgI',
'/msmt/20211029T170613Z_webconnectivity_ES_57269_n1_EInAEuLz87EAYjB0',
'/msmt/20211029T170613Z_webconnectivity_ES_57269_n1_EInAEuLz87EAYjB0',
'/msmt/20211029T170459Z_webconnectivity_AM_49800_n1_Zgh5zy3RqetZ9BoZ',
'/msmt/20211029T170344Z_webconnectivity_KH_131178_n1_nfAoW2KJTjaHoERe',
'/msmt/20211029T155403Z_webconnectivity_ZA_36937_n1_i0mnVUpT44okty8Q',
'/msmt/20211029T170408Z_webconnectivity_US_60068_n1_yUrHE6AgujsLgLj7',
'/msmt/20211029T170545Z_webconnectivity_MY_9534_n1_vMoJmv5j7wPv8LG7',
'/msmt/20211029T170514Z_webconnectivity_DE_24961_n1_D3KBnbJe4UXAZbJJ',
'/msmt/20211029T155403Z_webconnectivity_ZA_36937_n1_i0mnVUpT44okty8Q',
'/msmt/20211029T130445Z_webconnectivity_RU_12389_n1_iErIuiLBN7exx35v',
'/msmt/20211029T155403Z_webconnectivity_ZA_36937_n1_i0mnVUpT44okty8Q',
'/msmt/20211029T170731Z_riseupvpn_DE_3209_n1_fwEYmGoxFYwADpBI',
'/msmt/20211029T170730Z_tor_LT_25406_n1_nIqfhPZF5dhopr9J',
'/msmt/20211029T170730Z_signal_SE_39351_n1_uC2PvUaeao2oodu9',
]

export default class About extends React.Component {
  render () {

    return (
      <Layout>
        <Head>
          <title>About OONI Explorer</title>
        </Head>

        <NavBar />

        <Container>
          <Heading h={2}>XXX Implement Me</Heading>
          <Text>Do we even need an about page?</Text>
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link}>
                  <a>{link}</a>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Layout>
    )
  }

}
