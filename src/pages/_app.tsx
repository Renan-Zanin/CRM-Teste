import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { TransactionsProvider } from "../contexts/TransactionsContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <TransactionsProvider>
        <Component {...pageProps} />
      </TransactionsProvider>
    </ChakraProvider>
  );
}

export default MyApp;
