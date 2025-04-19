import { useEffect } from 'react';
import { useCreditsStore } from '../stores/credits';

export const useCredits = () => {
  const { creditsBalance, history, isLoading, error, fetchBalance, fetchHistory, purchaseCredits } = useCreditsStore();

  useEffect(() => {
    fetchBalance();
    fetchHistory();
  }, [fetchBalance, fetchHistory]);

  return {
    creditsBalance,
    history,
    isLoading,
    error,
    purchaseCredits,
  };
}; 