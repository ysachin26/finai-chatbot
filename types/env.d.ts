declare namespace NodeJS {
  interface ProcessEnv {
    GROQ_API_KEY: string
    NEXT_PUBLIC_STELLAR_NETWORK: "PUBLIC" | "TESTNET"
  }
}
