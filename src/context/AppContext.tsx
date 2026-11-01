"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DraftItem, Transaction, WorthItRating } from "@/types";
import {
  INITIAL_REAL_BALANCE,
  INITIAL_DRAFTS,
  INITIAL_TRANSACTIONS,
} from "@/data/initialData";

interface AppContextType {
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
  addDraft: (draft: Omit<DraftItem, "id">) => void;
  deleteDraft: (id: string) => void;
  completeDraft: (
    draftId: string | null,
    actualAmount: number,
    rating: WorthItRating,
    reflection?: string,
    customTitle?: string,
    customCategory?: string
  ) => void;
  updateRealBalance: (newBalance: number) => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BALANCE: "worthit_real_balance",
  DRAFTS: "worthit_drafts",
  TRANSACTIONS: "worthit_transactions",
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [realBalance, setRealBalance] = useState<number>(INITIAL_REAL_BALANCE);
  const [drafts, setDrafts] = useState<DraftItem[]>(INITIAL_DRAFTS);
  const [transactions, setTransactions] = useState<Transaction[]>(
    INITIAL_TRANSACTIONS
  );
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "drafts" | "insights" | "profile"
  >("dashboard");
  const [isBalanceHidden, setIsBalanceHidden] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [selectedDraftForDone, setSelectedDraftForDone] =
    useState<DraftItem | null>(null);
  const [isAddDraftModalOpen, setIsAddDraftModalOpen] =
    useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem(STORAGE_KEYS.BALANCE);
      const savedDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

      if (savedBalance !== null) {
        setRealBalance(Number(savedBalance));
      }
      if (savedDrafts !== null) {
        setDrafts(JSON.parse(savedDrafts));
      }
      if (savedTx !== null) {
        setTransactions(JSON.parse(savedTx));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BALANCE, String(realBalance));
      localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
      localStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(transactions)
      );
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
    }
  }, [realBalance, drafts, transactions, isHydrated]);

  // Derived state calculations
  const lockedInDrafts = drafts.reduce(
    (sum, item) => sum + (item.estimatedCost || 0),
    0
  );
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

  const addDraft = (draft: Omit<DraftItem, "id">) => {
    const newItem: DraftItem = {
      ...draft,
      id: `draft-${Date.now()}`,
    };
    setDrafts((prev) => [newItem, ...prev]);
  };

  const deleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((item) => item.id !== id));
  };

  const completeDraft = (
    draftId: string | null,
    actualAmount: number,
    rating: WorthItRating,
    reflection?: string,
    customTitle?: string,
    customCategory?: string
  ) => {
    let itemTitle = customTitle || "Expense Scan";
    let itemCategory = customCategory || "General Spend";
    let iconType = "receipt";

    if (draftId) {
      const existing = drafts.find((d) => d.id === draftId);
      if (existing) {
        itemTitle = existing.title;
        itemCategory = existing.subtag || existing.category;
        iconType = existing.category === "to-go" ? "ramen" : existing.category === "to-buy" ? "shopping" : "palette";
        // Remove from drafts
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    }

    // Deduct real balance
    setRealBalance((prev) => prev - actualAmount);

    // Create new transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: itemTitle,
      type: "expense",
      amount: actualAmount,
      category: itemCategory,
      time: "Just now",
      rating,
      iconType,
      reflection: reflection || (rating === "worth-it" ? "Worth every rupiah!" : rating === "so-so" ? "Okay experience." : "Waste of money / Regret."),
    };

    setTransactions((prev) => [newTx, ...prev]);
    closeScanModal();
  };

  const updateRealBalance = (newBalance: number) => {
    setRealBalance(newBalance);
  };

  const resetData = () => {
    setRealBalance(INITIAL_REAL_BALANCE);
    setDrafts(INITIAL_DRAFTS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BALANCE);
    localStorage.removeItem(STORAGE_KEYS.DRAFTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  };

  return (
    <AppContext.Provider
      value={{
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
        addDraft,
        deleteDraft,
        completeDraft,
        updateRealBalance,
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
