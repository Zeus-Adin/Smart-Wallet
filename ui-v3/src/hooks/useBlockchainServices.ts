import { useState } from "react";
import { useBlockchainService } from "./useBlockchainService";
import { TransactionParams } from "@/services/blockchainService";
import { Recipient, Transaction } from "@/services/transactionDataService";

export const useBlockchainServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  const blockchainService = useBlockchainService();

  const sendTransaction = async (params: TransactionParams) => {
    setIsLoading(true);
    try {
      const result = await blockchainService.sendTransaction(params);
      console.log("Transaction sent:", result);
      return result;
    } catch (error) {
      console.error("Failed to send transaction:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentData = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      await blockchainService.loadRecentData(walletAddress);
      setTransactions(blockchainService.transactions);
      setRecipients(blockchainService.recipients);
    } catch (error) {
      console.error("Failed to load recent data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendTransaction,
    loadRecentData,
    transactions: blockchainService.transactions,
    recipients: blockchainService.recipients,
    isLoading: blockchainService.isLoading || isLoading,
  };
};
