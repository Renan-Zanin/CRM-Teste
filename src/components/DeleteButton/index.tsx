import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { db } from "../../utils/firebaseUtils";
import "react-toastify/dist/ReactToastify.css";

interface DeletProps {
  referenceId: string;
  dbReference: string;
}

export function DeleteButton({ referenceId, dbReference }: DeletProps) {
  const { fetchTransactions, fetchClients } = useContext(TransactionsContext);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);

  function toastSuccess() {
    toast.success("Dado excluído com sucesso", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function toastError() {
    toast.error("Houve algum erro", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  async function handleDelete() {
    const transactionRef = doc(db, dbReference, referenceId);
    setIsLoading(true);

    await deleteDoc(transactionRef)
      .then(() => {
        toastSuccess();
        fetchTransactions();
        fetchClients();
        setIsLoading(false);
        onClose();
      })
      .catch((err) => toastError());
  }

  return (
    <>
      <Button colorScheme="red" p="2" onClick={onOpen}>
        <Icon as={BsTrash} fontSize="16" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent bg="gray.800">
          <ModalHeader>Realmente deseja excluir esse dado?</ModalHeader>
          <ModalCloseButton />

          <ModalFooter>
            <Flex gap="6">
              <Button
                variant="ghost"
                mr={3}
                onClick={onClose}
                colorScheme="red"
                p="6"
                disabled={isLoading}
                _hover={{ bg: "red.500", color: "white" }}
              >
                Não
              </Button>
              <Button
                colorScheme="green"
                mr={3}
                p="6"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Sim"}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </>
  );
}
