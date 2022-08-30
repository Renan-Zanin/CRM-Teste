import {
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiAddLine } from "react-icons/ri";
import { Input } from "../Form/Input";
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, serverTamp } from "../../utils/firebaseUtils";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { toast, ToastContainer } from "react-toastify";

interface NewTransactionProps {
  clientId: string | undefined | string[];
}

const newTransactionFormSchema = zod.object({
  value: zod.number(),
  type: zod.enum(["income", "outcome"]),
});

type NewTransactionFormInput = zod.infer<typeof newTransactionFormSchema>;

export function NewTransactionModal({ clientId }: NewTransactionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { fetchTransactions } = useContext(TransactionsContext);

  const { register, handleSubmit, control, reset } =
    useForm<NewTransactionFormInput>({
      resolver: zodResolver(newTransactionFormSchema),
      defaultValues: {
        type: "outcome",
      },
    });

  function toastSuccess() {
    toast.success("Transação cadastrada com sucesso", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function toastError() {
    toast.error("Não foi possível cadastrar uma nova transação", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      draggable: true,
      progress: undefined,
    });
  }

  function handleCreateNewTransaction(data: NewTransactionFormInput) {
    setIsLoading(true);

    const { value, type } = data;

    const transactionRef = collection(db, `clients/${clientId}/transactions`);

    addDoc(transactionRef, {
      value,
      type,
      created_at: serverTamp.now(),
    })
      .then((response) => {
        toastSuccess();
        fetchTransactions();
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
        Nova transação
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader>Cadastrar nova transação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex as="form" direction="column" gap="6">
              <Input
                idName="value"
                type="number"
                label="Valor"
                {...register("value", { valueAsNumber: true })}
              />

              <Controller
                control={control}
                name="type"
                render={({ field }) => {
                  return (
                    <RadioGroup
                      defaultValue="outcome"
                      onChange={field.onChange}
                      value={field.value}
                    >
                      <Flex direction="row" justify="space-between">
                        <Radio
                          colorScheme="red"
                          value="outcome"
                          size="lg"
                          px={8}
                        >
                          <Text fontSize="2xl">Saída</Text>
                        </Radio>
                        <Radio
                          colorScheme="green"
                          value="income"
                          size="lg"
                          px={8}
                        >
                          <Text fontSize="2xl">Entrada</Text>
                        </Radio>
                      </Flex>
                    </RadioGroup>
                  );
                }}
              />

              <ModalFooter>
                <Button
                  colorScheme="green"
                  w="100%"
                  h="14"
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit(handleCreateNewTransaction)}
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
