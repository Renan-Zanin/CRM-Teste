import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import Link from "next/link";
import { RiSearchLine } from "react-icons/ri";
import { NewClientModal } from "../../components/NewClientModal";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseUtils";
import { dateFormat, telephoneFormatter } from "../../utils/formatter";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { UpdateClientModal } from "../../components/UpdateClientModal";
import { DeleteButton } from "../../components/DeleteButton";

type ClientsProps = {
  id: string;
  name: string;
  telephone: number;
  created_at: Date;
};

export default function UserList() {
  const [filterdClients, setFilteredClients] = useState<ClientsProps[]>([]);
  const [search, setSearch] = useState("");

  const { clients } = useContext(TransactionsContext);

  useEffect(() => {
    setFilteredClients(
      clients.filter((client) =>
        client.name.toLocaleLowerCase().includes(search.toLowerCase())
      )
    );
    console.log("filterdClients");
  }, [clients, search]);

  return (
    <Box maxWidth={1180} mx="auto">
      <Header />

      <Flex
        as="form"
        flex="1"
        py="2"
        px="8"
        maxWidth={400}
        alignSelf="center"
        color="gray.200"
        bg="gray.800"
        borderRadius="full"
        ml="6"
        mt="8"
      >
        <Input
          color="gray.500"
          variant="unstyled"
          type="text"
          px="4"
          mr="4"
          placeholder="Buscar por cliente"
          _placeholder={{ color: "gray.400" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" variant="unstyled">
          <Icon as={RiSearchLine} fontSize="20" />
        </Button>
      </Flex>
      <Flex width="100%" my="6" maxWidth={1180} mx="auto" px="6">
        <Box flex="1" borderRadius={8} bg="gray.800" p="8">
          <Flex mb="8" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              Clientes
            </Heading>
            <NewClientModal />
          </Flex>

          <Table colorScheme="whiteAlpha">
            <Thead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Data de cadastro</Th>
                <Th width="36"></Th>
                <Th width="8"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filterdClients.map((client: ClientsProps) => {
                return (
                  <Tr key={client.id}>
                    <Td>
                      <Box>
                        <Button variant="unstyled" my="-2">
                          <Link
                            color="green.500"
                            href={{
                              pathname: "/transactions",
                              query: { id: client.id },
                            }}
                          >
                            <Text
                              fontWeight="bold"
                              color="green.500"
                              _hover={{
                                color: "green.600",
                                textDecoration: "underline",
                              }}
                            >
                              {client.name}
                            </Text>
                          </Link>
                        </Button>
                        <Text fontSize="sm" color="gray.300" mt="1">
                          {telephoneFormatter(client.telephone)}
                        </Text>
                      </Box>
                    </Td>
                    <Td>{dateFormat(client.created_at)}</Td>
                    <Td>
                      <UpdateClientModal
                        clientId={client.id}
                        clientName={client.name}
                        clientPhone={client.telephone}
                      />
                    </Td>
                    <Td>
                      <DeleteButton
                        referenceId={client.id}
                        dbReference="clients"
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
