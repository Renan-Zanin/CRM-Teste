import { Flex, Grid, GridItem, Icon, Text } from "@chakra-ui/react";
import { MdArrowCircleUp, MdOutlineArrowCircleDown } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import { useSummary } from "../../hooks/useSummary";
import { priceFormatter } from "../../utils/formatter";

export function Summary() {
  const summary = useSummary();

  return (
    <Flex w="100%" maxWidth={1180} mx="auto" mt="4" align="center" px="6">
      <Grid gap={8} templateColumns="repeat(3, 1fr)" w={1180}>
        <GridItem borderRadius={6} padding={8} bg="gray.700">
          <Flex gap={4} align="center" justify="space-between">
            <Text>VALORES PAGOS</Text>
            <Icon as={MdArrowCircleUp} fontSize="32" color="#42c43d" />
          </Flex>
          <Text mt="4" fontSize="3xl" fontWeight="bold" color="green.500">
            {priceFormatter.format(summary.income)}
          </Text>
        </GridItem>
        <GridItem borderRadius={6} padding={8} bg="gray.700">
          <Flex gap={4} align="center" justify="space-between">
            <Text>EM DÍVIDA</Text>
            <Icon as={MdOutlineArrowCircleDown} fontSize="32" color="red" />
          </Flex>
          <Text mt="4" fontSize="3xl" fontWeight="bold" color="red.500">
            {priceFormatter.format(summary.outcome)}
          </Text>
        </GridItem>
        <GridItem
          borderRadius={6}
          padding={8}
          bg={summary.total < -0.001 ? "red.500" : "green.500"}
        >
          <Flex gap={4} align="center" justify="space-between">
            <Text>TOTAL</Text>
            <Icon as={FiDollarSign} fontSize="32" color="white" />
          </Flex>
          <Text mt="4" fontSize="3xl" fontWeight="bold">
            {priceFormatter.format(summary.total)}
          </Text>
        </GridItem>
      </Grid>
    </Flex>
  );
}
