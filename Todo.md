# Frontend TODO

## Major

### General purpose components

* Implement footer component

### Country page

* Implement or select a table component suitable for our use case

* Implement charts for country page

- Bar chart for "types of blocked websites"

- Sparkline for "Measurements by test class"

- Websites chart

### Measurements

Views for the following measurement types:

- Web Connectivity

- HTTP Invalid request Line

- HTTP Header Field Manipulation

- NDT Speed Test

- DASH video streaming

- Telegram test

- WhatsApp

- Facebook Messenger

- Generic unclassified page

Charts:

- Download speed by time chart component

## Search page

* Align the form components with the mockups

* Add by date sortable

## Minor/cleanup refactor

* Ensure all the props are validated properly and pass all the eslint tests.

# Backend TODO

## Country page

* Number of networks that showed the presence of a middlebox

* If Instant messagging apps might be blocked

* If Circumvention tools are working

* Types of blocked websites (as in the number of sites per category found to be blocked)

* Time series of number measurements per test class (websites, im, middleboxes, etc.)

* Time series of number of measurements per ASN by test class

* Total number of measurements for the given country

* Total number of network tested for a given country

* Median upload and download speed

* Dash measurements that show testers can stream more than a certain type of video quality

* IM app blocking status grouped by ASN

* Middlebox presence status grouped by ASN

* Anomaly, measurements, and blocked counts per website. (Perhaps break this down per ASN too)
