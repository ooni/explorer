import type { CustomProjectConfig } from 'lost-pixel'

export const config: CustomProjectConfig = {
  pageShots: {
    pages: [
      { path: '/', name: 'homepage' },
      {
        path: '/social-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
        name: 'social-media',
      },
      {
        path: '/news-media?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
        name: 'news-media',
      },
      {
        path: '/circumvention?since=2025-03-01&until=2025-03-02&probe_cc=CN%2CIR%2CRU',
        name: 'circumvention',
      },
      {
        path: '/domain/twitter.com?since=2025-03-01&until=2025-03-02',
        name: 'domain',
      },
      {
        path: '/as/AS31334?since=2025-03-01&until=2025-03-02',
        name: 'network',
      },
      {
        path: '/chart/mat?test_name=web_connectivity&axis_x=measurement_start_day&since=2025-03-01&until=2025-03-02&time_grain=day',
        name: 'mat',
      },
      {
        path: '/search?since=2025-03-01&until=2025-03-02&failure=false',
        name: 'search',
      },
      {
        path: '/m/20250417130101.205170_IR_webconnectivity_42664e94d85d48eb',
        name: 'web-connectivity-OK',
      },
      {
        path: '/m/20250417130231.077567_IR_webconnectivity_686a5762b08f5baf',
        name: 'web-connectivity-CONFIRMED',
      },
    ],
    baseUrl:
      process.env.GITHUB_ACTIONS === 'true'
        ? 'http://172.17.0.1:3100'
        : 'http://localhost:3100',
  },
  // OSS mode
  generateOnly: true,
  failOnDifference: true,
  waitBeforeScreenshot: 5000,
  lostPixelProjectId: 'cm9ldxgtv0s5s3wy0f1s8vo70',
  apiKey: process.env.LOST_PIXEL_API_KEY,

  // Lost Pixel Platform (to use in Platform mode, comment out the OSS mode and uncomment this part )
  // lostPixelProjectId: "xxxx",
  // process.env.LOST_PIXEL_API_KEY,
}
