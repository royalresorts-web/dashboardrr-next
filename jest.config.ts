import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Ruta a tu app Next.js
  dir: './',
})

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // Esto fuerza a Jest a usar la configuración de TS de tu proyecto
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)