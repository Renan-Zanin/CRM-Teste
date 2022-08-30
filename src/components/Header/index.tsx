import {
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Router from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../../utils/firebaseUtils";
import { BsPower } from "react-icons/bs";
import Link from "next/link";

export function Header() {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;
    if (!user) Router.push("/");
  }, [user, loading]);

  return (
    <Flex
      w="100%"
      as="header"
      maxWidth={1180}
      h="32"
      mx="auto"
      mt="4"
      align="center"
      justify="space-between"
      px="6"
    >
      <Flex h="28">
        <Link href="/users">
          <Image src="/logo.png" alt="" fit="contain" />
        </Link>
      </Flex>
      <Button
        colorScheme="red"
        onClick={logout}
        justifyContent="center"
        alignItems="center"
      >
        Sair <Icon as={BsPower} ml="2" />
      </Button>
    </Flex>
  );
}
