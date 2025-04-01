// import type { CustomProjectConfig } from 'lost-pixel'

export const config = {
  pageShots: {
    pages: [
      { path: '/social-media', name: 'social-media' },
      //   { path: '/next-app?name=App', name: 'next-app-with-query-param' },
    ],
    // IP should be localhost when running locally & 172.17.0.1 when running in GitHub action

    baseUrl: 'http://localhost:3100',
  },
  // OSS mode
  generateOnly: true,
  failOnDifference: true,
  lostPixelProjectId: 'cm8ygw0lo0s9zg9qy1lg9p86r',
  apiKey: process.env.LOST_PIXEL_API_KEY,

  // Lost Pixel Platform (to use in Platform mode, comment out the OSS mode and uncomment this part )
  // lostPixelProjectId: "xxxx",
  // process.env.LOST_PIXEL_API_KEY,
}
