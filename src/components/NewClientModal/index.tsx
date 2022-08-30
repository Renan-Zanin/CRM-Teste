import {
  Button,
  Flex,
  Icon,
  InputProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { RiAddLine } from "react-icons/ri";
import { db, serverTamp } from "../../utils/firebaseUtils";
import { Input } from "../Form/Input";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { toast, ToastContainer } from "react-toastify";

const newClientFormSchema = zod.object({
  name: zod.string(),
  telephone: zod.number(),
});

type NewClientFormInputs = zod.infer<typeof newClientFormSchema>;

export function NewClientModal() {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { fetchClients } = useContext(TransactionsContext);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewClientFormInputs>({
    resolver: zodResolver(newClientFormSchema),
  });

  function toastSuccess() {
    toast.success("Cliente cadastrado com sucesso", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function toastError() {
    toast.error("Não foi possível cadastrar um novo cliente", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function handleCreateNewClientModal(data: NewClientFormInputs) {
    setIsLoading(true);
    const { name, telephone } = data;

    if (!name || !telephone) {
      return alert("Preencha todos os campos");
    }

    const clientRef = collection(db, "clients");
    addDoc(clientRef, {
      name,
      telephone,
      created_at: serverTamp.now(),
    })
      .then(() => {
        toastSuccess();
        fetchClients();
        setIsLoading(false);
        onClose();
        reset();
      })
      .catch((err) => {
        console.log(err);
        toastError();
      });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
      <Button
        as="a"
        size="sm"
        fontSize="sm"
        colorScheme="green"
        leftIcon={<Icon as={RiAddLine} fontSize="20" />}
        onClick={onOpen}
        cursor="pointer"
      >
        Cadastrar novo cliente
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Novo cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex as="form" direction="column" gap="6">
              <Input
                idName="name"
                type="text"
                label="Nome"
                required
                {...register("name")}
              />
              <Input
                idName="telephone"
                type="number"
                label="Telefone"
                required
                {...register("telephone", { valueAsNumber: true })}
              />
              <ModalFooter mr="-8">
                <Button
                  variant="ghost"
                  mr={3}
                  onClick={onClose}
                  colorScheme="red"
                  disabled={isLoading}
                  _hover={{ bg: "red.500", color: "white" }}
                >
                  Fechar
                </Button>
                <Button
                  colorScheme="green"
                  mr={3}
                  disabled={isLoading}
                  onClick={handleSubmit(handleCreateNewClientModal)}
                >
                  {isLoading ? <Spinner /> : "Cadastrar"}
                </Button>
              </ModalFooter>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
