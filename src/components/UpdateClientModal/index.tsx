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
import {
  addDoc,
  collection,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { db, serverTamp } from "../../utils/firebaseUtils";
import { Input } from "../Form/Input";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { toast, ToastContainer } from "react-toastify";

interface UpdateClientProps {
  clientId: string;
}

const newClientFormSchema = zod.object({
  name: zod.string(),
  telephone: zod.number(),
});

type NewClientFormInputs = zod.infer<typeof newClientFormSchema>;

export function UpdateClientModal({ clientId }: UpdateClientProps) {
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
    toast.success("Cliente atualizado com sucesso", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function toastError() {
    toast.error("Não foi possível atualizar os dados do cliente", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function handleUpdateClientModal(data: NewClientFormInputs) {
    setIsLoading(true);

    const { name, telephone } = data;

    if (!name || !telephone) {
      return alert("Preencha todos os campos");
    }

    const clientRef = doc(db, "clients", clientId);

    updateDoc(clientRef, { name, telephone })
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
        colorScheme="blue"
        leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
        onClick={onOpen}
        cursor="pointer"
      >
        Editar
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Editar cliente</ModalHeader>
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
                  onClick={handleSubmit(handleUpdateClientModal)}
                >
                  {isLoading ? <Spinner /> : "Atualizar"}
                </Button>
              </ModalFooter>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
