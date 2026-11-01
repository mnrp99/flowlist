"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DraftItem, Transaction, WorthItRating } from "@/types";
import {
  getAppData,
  addIncome as addIncomeAction,
  addExpenseDirect as addExpenseDirectAction,
  createPlan as createPlanAction,
  completeTodoPlan as completeTodoPlanAction,
  completePaidPlan as completePaidPlanAction,
  deletePlan as deletePlanAction,
  deleteTransaction as deleteTransactionAction,
  updateWalletBalance as updateWalletBalanceAction,
} from "@/actions/worthit";

export interface CurrentUser {
  id: string;
  email: string;
}

interface AppContextType {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  isSyncing: boolean;
  refreshData: () => Promise<void>;
  realBalance: number;
  drafts: DraftItem[];
  transactions: Transaction[];
  lockedInDrafts: number;
  safeToSpend: number;
  activeTab: "dashboard" | "drafts" | "insights" | "profile";
  setActiveTab: (tab: "dashboard" | "drafts" | "insights" | "profile") => void;
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
  isScanModalOpen: boolean;
  selectedDraftForDone: DraftItem | null;
  openScanModal: (draft?: DraftItem | null) => void;
  closeScanModal: () => void;
  isAddDraftModalOpen: boolean;
  openAddDraftModal: () => void;
  closeAddDraftModal: () => void;
  isAddIncomeModalOpen: boolean;
  openAddIncomeModal: () => void;
  closeAddIncomeModal: () => void;
  addDraft: (draft: Omit<DraftItem, "id">) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  toggleTodoCompleted: (id: string) => Promise<void>;
  completeDraft: (
    draftId: string | null,
    actualAmount: number,
    rating: WorthItRating,
    reflection?: string,
    customTitle?: string,
    customCategory?: string
  ) => Promise<void>;
  addIncome: (
    amount: number,
    source: string,
    title?: string,
    dateStr?: string
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateRealBalance: (newBalance: number) => Promise<void>;
  logout: () => Promise<void>;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const supabase = createClient();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [realBalance, setRealBalance] = useState<number>(0);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "drafts" | "insights" | "profile"
  >("dashboard");
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [selectedDraftForDone, setSelectedDraftForDone] =
    useState<DraftItem | null>(null);
  const [isAddDraftModalOpen, setIsAddDraftModalOpen] =
    useState<boolean>(false);
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] =
    useState<boolean>(false);

  // Fetch initial data from server action
  const loadData = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await getAppData();
      if (res.error || !res.data) {
        // Not authenticated -> redirect to /login
        router.push("/login");
        return;
      }

      setCurrentUser(res.data.user);
      setRealBalance(res.data.wallet.realBalance);
      setDrafts(res.data.drafts);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Failed to load app data from server:", err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [router]);

  // Initial load & Supabase Auth state listener
  useEffect(() => {
    loadData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        loadData();
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        setRealBalance(0);
        setDrafts([]);
        setTransactions([]);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadData, supabase, router]);

  // Derived calculations: To-Do items do not lock money (estimatedCost is 0)
  const lockedInDrafts = drafts.reduce((sum, item) => {
    if (item.category === "to-do" || item.completed) return sum;
    return sum + (item.estimatedCost || 0);
  }, 0);

  const safeToSpend = realBalance - lockedInDrafts;

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden((prev) => !prev);
  };

  const openScanModal = (draft?: DraftItem | null) => {
    setSelectedDraftForDone(draft || null);
    setIsScanModalOpen(true);
  };

  const closeScanModal = () => {
    setIsScanModalOpen(false);
    setSelectedDraftForDone(null);
  };

  const openAddDraftModal = () => {
    setIsAddDraftModalOpen(true);
  };

  const closeAddDraftModal = () => {
    setIsAddDraftModalOpen(false);
  };

  const openAddIncomeModal = () => {
    setIsAddIncomeModalOpen(true);
  };

  const closeAddIncomeModal = () => {
    setIsAddIncomeModalOpen(false);
  };

  // Add draft (Server Action + Optimistic Update)
  const addDraft = async (draft: Omit<DraftItem, "id">) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem: DraftItem = {
      ...draft,
      id: tempId,
      estimatedCost: draft.category === "to-do" ? 0 : draft.estimatedCost,
      completed: false,
    };

    setDrafts((prev) => [optimisticItem, ...prev]);

    try {
      setIsSyncing(true);
      await createPlanAction({
        title: draft.title,
        category: draft.category,
        subCategory: draft.subtag,
        estimatedCost: draft.category === "to-do" ? 0 : draft.estimatedCost,
        priority: draft.priority,
        referenceUrl: draft.link,
        imageUrl: draft.image,
        notes: draft.notes,
        targetDate: draft.date,
      });
      await loadData();
    } catch (e) {
      console.error("Failed to create plan:", e);
      // rollback
      setDrafts((prev) => prev.filter((d) => d.id !== tempId));
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete draft (Server Action + Optimistic Update)
  const deleteDraft = async (id: string) => {
    const target = drafts.find((d) => d.id === id);
    setDrafts((prev) => prev.filter((item) => item.id !== id));

    try {
      setIsSyncing(true);
      await deletePlanAction(id);
    } catch (e) {
      console.error("Failed to delete plan:", e);
      if (target) {
        setDrafts((prev) => [target, ...prev]);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle To-Do activity completion (1-click checkbox)
  const toggleTodoCompleted = async (id: string) => {
    setDrafts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

    try {
      setIsSyncing(true);
      await completeTodoPlanAction(id);
    } catch (e) {
      console.error("Failed to toggle todo completion:", e);
      // Revert on failure
      setDrafts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Complete Paid Plan / Direct Expense
  const completeDraft = async (
    draftId: string | null,
    actualAmount: number,
    rating: WorthItRating,
    reflection?: string,
    customTitle?: string,
    customCategory?: string
  ) => {
    let itemTitle = customTitle || "Expense Scan";
    let itemCategory = customCategory || "General Spend";

    if (draftId) {
      const existing = drafts.find((d) => d.id === draftId);
      if (existing) {
        itemTitle = existing.title;
        itemCategory = existing.subtag || existing.category;
      }
      // Optimistically remove from drafts
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    }

    // Optimistically deduct real balance
    setRealBalance((prev) => prev - actualAmount);

    // Optimistically prepend transaction
    const optimisticTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: itemTitle,
      type: "expense",
      amount: actualAmount,
      category: itemCategory,
      time: "Hari ini, Baru saja",
      rating,
      iconType: "receipt",
      reflection:
        reflection ||
        (rating === "worth-it"
          ? "Worth every rupiah!"
          : rating === "so-so"
          ? "Pengalaman cukup lumayan."
          : "Waste of money / Menyesal."),
    };
    setTransactions((prev) => [optimisticTx, ...prev]);
    closeScanModal();

    try {
      setIsSyncing(true);
      if (draftId) {
        await completePaidPlanAction(draftId, actualAmount, rating);
      } else {
        await addExpenseDirectAction(
          itemTitle,
          actualAmount,
          itemCategory,
          rating
        );
      }
      await loadData();
    } catch (e) {
      console.error("Failed to complete expense:", e);
      await loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Income (Top-up balance)
  const addIncome = async (
    amount: number,
    source: string,
    title?: string,
    dateStr?: string
  ) => {
    const finalTitle = title || `${source} Payout`;

    // Optimistic balance update
    setRealBalance((prev) => prev + amount);

    // Optimistic transaction
    const optimisticTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: finalTitle,
      type: "income",
      amount,
      category: "INCOME",
      source,
      time: dateStr || "Hari ini, Baru saja",
      rating: null,
      iconType: "wallet",
    };
    setTransactions((prev) => [optimisticTx, ...prev]);
    closeAddIncomeModal();

    try {
      setIsSyncing(true);
      await addIncomeAction(finalTitle, amount, source, dateStr);
      await loadData();
    } catch (e) {
      console.error("Failed to add income:", e);
      await loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  // Delete transaction (revert balance)
  const deleteTransaction = async (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    // Optimistic balance reversal
    if (tx.type === "expense") {
      setRealBalance((prev) => prev + tx.amount);
    } else {
      setRealBalance((prev) => prev - tx.amount);
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    try {
      setIsSyncing(true);
      await deleteTransactionAction(id);
      await loadData();
    } catch (e) {
      console.error("Failed to delete transaction:", e);
      await loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  // Update real balance (Simulator in Profile)
  const updateRealBalance = async (newBalance: number) => {
    setRealBalance(newBalance);
    try {
      setIsSyncing(true);
      await updateWalletBalanceAction(newBalance);
      await loadData();
    } catch (e) {
      console.error("Failed to update wallet balance:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Failed to log out:", e);
    }
  };

  const resetData = () => {
    loadData();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoading,
        isSyncing,
        refreshData: loadData,
        realBalance,
        drafts,
        transactions,
        lockedInDrafts,
        safeToSpend,
        activeTab,
        setActiveTab,
        isBalanceHidden,
        toggleBalanceVisibility,
        isScanModalOpen,
        selectedDraftForDone,
        openScanModal,
        closeScanModal,
        isAddDraftModalOpen,
        openAddDraftModal,
        closeAddDraftModal,
        isAddIncomeModalOpen,
        openAddIncomeModal,
        closeAddIncomeModal,
        addDraft,
        deleteDraft,
        toggleTodoCompleted,
        completeDraft,
        addIncome,
        deleteTransaction,
        updateRealBalance,
        logout,
        resetData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
