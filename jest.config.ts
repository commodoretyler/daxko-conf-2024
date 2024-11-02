import { Config } from "jest";

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.tsx"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^.*[.](css|CSS)$": "<rootDir>/jest/mocks/styles.js",
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  resetMocks: true,
  testPathIgnorePatterns: ["/node_modules/"],
  //setupFiles: ["<rootDir>/jest/jest.setup.ts"],
  //setupFilesAfterEnv: ["<rootDir>/jest/jest.setup.ts"],
} satisfies Config;
