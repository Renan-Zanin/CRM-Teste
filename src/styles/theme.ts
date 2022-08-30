import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      "50": "#74f66f",
      "100": "#6aec65",
      "200": "#60e25b",
      "300": "#56d851",
      "400": "#4cce47",
      "500": "#42c43d",
      "600": "#38ba33",
      "700": "#2eb029",
      "800": "#24a61f",
      "900": "#1a9c15",
    },
    secondary: "#3296DB",
    gray: {
      "900": "#181B23",
      "800": "#1F2029",
      "700": "#353646",
      "600": "#4B4D63",
      "500": "#616480",
      "400": "#797D9A",
      "300": "#9699B0",
      "200": "#B3B5C6",
      "100": "#D1D2DC",
      "50": "#EEEEF2",
    },
  },

  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },

  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.50",
      },
    },
  },
});
