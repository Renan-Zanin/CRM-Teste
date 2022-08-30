import {
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { DeleteButton } from "../components/DeleteButton";
import { Header } from "../components/Header";
import { NewTransactionModal } from "../components/NewTransactionModal";
import { Summary } from "../components/Summary";
import { TransactionsContext } from "../contexts/TransactionsContext";
import { dateFormat, hourFormat, priceFormatter } from "../utils/formatter";

export default function Transactions() {
  const router = useRouter();
  const { id } = router.query;

  const { transactions } = useContext(TransactionsContext);

  let transaciontsByDate = transactions.sort((a: any, b: any) => {
    return b.created_at - a.created_at;
  });

  return (
    <Box>
      <Header />
      <Summary />

      <Flex width="100%" my="6" maxWidth={960} mx="auto" px="6">
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Transações
            </Heading>
            <NewTransactionModal clientId={id} />
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Tipo</Th>
                <Th>Data da transação</Th>
                <Th>Hora da transação</Th>
                <Th width="36">Valor</Th>
                <Th width="8"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {transaciontsByDate.map((transaction) => {
                return (
                  <Tr
                    key={transaction.id}
                    color={
                      transaction.type === "income" ? "green.500" : "red.500"
                    }
                  >
                    <Td>
                      <Box>
                        <Text fontWeight="bold">
                          {transaction.type === "income" ? "Pago" : "Deve"}
                        </Text>
                      </Box>
                    </Td>
                    <Td>{dateFormat(transaction.created_at)}</Td>
                    <Td>{hourFormat(transaction.created_at)}</Td>
                    <Td>
                      <Text
                        color={
                          transaction.type === "income"
                            ? "green.500"
                            : "red.500"
                        }
                      >
                        {transaction.type === "outcome" ? "- " : " "}
                        {priceFormatter.format(transaction.value)}
                      </Text>
                    </Td>
                    <Td>
                      <DeleteButton
                        referenceId={transaction.id}
                        dbReference={`clients/${id}/transactions`}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}
