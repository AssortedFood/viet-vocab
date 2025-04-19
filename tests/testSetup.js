// tests/testSetup.js
// Global test setup for Jest + React Testing Library
import '@testing-library/jest-dom'

// Polyfill a minimal WHATWG Response for Next.js route handlers
global.Response = class {
  constructor(body, init = {}) {
    this._body = body
    this.status = init.status ?? 200
    this.headers = init.headers ?? {}
  }

  static json(body, init) {
    return new Response(body, init)
  }

  async json() {
    return this._body
  }
}
