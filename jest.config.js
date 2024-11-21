module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'app.js',
    'server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 60,
      statements: 60
    }
  }
}
