import { Button, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { Input } from "../components/Form/Input";
import React, { useEffect, useState } from "react";
import { auth, logInWithEmailAndPassword } from "../utils/firebaseUtils";
import { useAuthState } from "react-firebase-hooks/auth";
import Router from "next/router";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      Router.push("/users");
    }
  }, [user, loading]);
  return (
    <Flex w="100vw" h="100vh" align="center" justify="center">
      <Flex
        w="100%"
        maxWidth={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDirection="column"
      >
        <Stack spacing={4}>
          <Input
            type="email"
            idName="email"
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            idName="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
        <Button
          mt="6"
          bg="brand.600"
          _hover={{ bg: "brand.800" }}
          size="lg"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          {loading ? <Spinner /> : <Text>Entrar</Text>}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
