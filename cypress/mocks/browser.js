// src/mocks/browser.js
import { setupWorker, rest } from 'msw'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
const worker = setupWorker(...handlers)

export { worker, rest }