import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  createContext,
} from "react";
import { db } from "../utils/firebaseUtils";

interface TransactionsProviderProps {
  children: ReactNode;
}

export interface Transaction {
  id: string;
  type: "income" | "outcome";
  value: number;
  created_at: Date;
}

interface Client {
  id: string;
  name: string;
  telephone: number;
  created_at: Date;
}

interface TransactionContextType {
  transactions: Transaction[];
  clients: Client[];
  fetchTransactions: (query?: string) => Promise<void>;
  fetchClients: () => Promise<void>;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

export const TransactionsContext = createContext<TransactionContextType>(
  {} as TransactionContextType
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const router = useRouter();
  const { id } = router.query;

  const fetchTransactions = useCallback(async () => {
    const transactionsRef = collection(db, `clients/${id}/transactions`);
    await getDocs(transactionsRef)
      .then((response) => {
        const transactionsList = response.docs.map((doc) => {
          const { value, created_at, type } = doc.data();

          return {
            id: doc.id,
            value,
            created_at,
            type,
          };
        });

        setTransactions(transactionsList);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const fetchClients = useCallback(async () => {
    const clientsColletionRef = collection(db, "clients");
    await getDocs(clientsColletionRef)
      .then((response) => {
        const clientList = response.docs.map((doc) => {
          const { name, created_at, telephone } = doc.data();

          return {
            id: doc.id,
            name,
            created_at,
            telephone,
          };
        });

        setClients(clientList);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, fetchClients, clients }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
