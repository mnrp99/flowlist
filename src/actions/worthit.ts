"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import {
  PlanCategory,
  PlanStatus,
  TransactionType,
  WorthItRating as PrismaWorthItRating,
} from "@prisma/client";
import { DraftCategory, PriorityLevel, WorthItRating, DraftItem, Transaction } from "@/types";
import { createGoogleCalendarUrl } from "@/utils/calendar";

import {
  mapCategoryToPrisma,
  mapCategoryFromPrisma,
  mapRatingToPrisma,
  mapRatingFromPrisma,
} from "@/utils/mappers";

export interface CreatePlanInput {
  title: string;
  category: DraftCategory;
  subCategory?: string;
  estimatedCost?: number;
  paxCount?: number;
  priority?: PriorityLevel;
  referenceUrl?: string;
  imageUrl?: string;
  locationName?: string;
  targetDate?: string;
  notes?: string;
}

/**
 * 1. getAppData: Mengambil data Wallet, semua Plan, dan semua Transaction milik user yang sedang login.
 * Auto-creates Wallet record with realBalance: 0 if not present.
 */
export async function getAppData() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  // 1. Auto-create Wallet if it does not exist
  let wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        realBalance: 0,
      },
    });
  }

  // 2. Fetch user's plans (ordered by creation date)
  const dbPlans = await prisma.plan.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch user's transactions (ordered by transaction date)
  const dbTransactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { transactionDate: "desc" },
  });

  // Transform dbPlans to DraftItem for seamless UI compatibility
  const drafts: DraftItem[] = dbPlans.map((p) => {
    const category = mapCategoryFromPrisma(p.category);
    const tag =
      category === "to-go"
        ? "📍 To-Go"
        : category === "to-buy"
        ? "🛍️ To-Buy"
        : "📅 To-Do";

    let meta = "";
    if (category === "to-go") {
      meta = p.paxCount > 1 ? `${p.paxCount} pax` : "Solo visit";
    } else if (category === "to-buy") {
      meta = p.referenceUrl ? "Online Wishlist" : "In-store target";
    } else {
      meta = p.priority ? `${p.priority.toUpperCase()} priority` : "Task";
    }

    const dateStr = p.targetDate
      ? p.targetDate.toISOString()
      : p.createdAt.toISOString();

    const gcalUrl = createGoogleCalendarUrl(
      p.title,
      p.targetDate,
      p.locationName,
      p.notes
    );

    return {
      id: p.id,
      title: p.title,
      category,
      tag,
      subtag: p.subCategory || "General",
      estimatedCost: p.category === PlanCategory.TO_DO ? 0 : p.estimatedCost,
      meta,
      date: dateStr,
      icon:
        category === "to-go"
          ? "ramen"
          : category === "to-buy"
          ? "shopping"
          : "calendar",
      image: p.imageUrl || undefined,
      link: p.referenceUrl || undefined,
      googleCalendarUrl: gcalUrl,
      notes: p.notes || undefined,
      priority: p.priority ? (p.priority.toLowerCase() as PriorityLevel) : undefined,
      completed: p.status === PlanStatus.COMPLETED,
    };
  });

  // Transform dbTransactions to Transaction
  const transactions: Transaction[] = dbTransactions.map((tx) => {
    const isIncome = tx.type === TransactionType.INCOME;
    const rating = mapRatingFromPrisma(tx.worthItRating);

    let reflection = "";
    if (!isIncome) {
      reflection =
        rating === "worth-it"
          ? "Worth every rupiah! (Best Value)"
          : rating === "so-so"
          ? "Pengalaman cukup lumayan (So-so)."
          : "Wasted money / Penyesalan (Never Again).";
    }

    // Format display date
    const d = new Date(tx.transactionDate);
    const dateFormatted = d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      id: tx.id,
      title: tx.title,
      type: isIncome ? "income" : "expense",
      amount: tx.amount,
      category: tx.category,
      time: dateFormatted,
      rating,
      iconType: isIncome ? "wallet" : "receipt",
      source: isIncome ? tx.category : undefined,
      reflection: isIncome ? "Pemasukan berhasil ditambahkan ke saldo" : reflection,
    };
  });

  return {
    error: null,
    data: {
      user: {
        id: user.id,
        email: user.email ?? "",
      },
      wallet: {
        realBalance: wallet.realBalance,
      },
      drafts,
      transactions,
    },
  };
}

/**
 * 2. addIncome: Menambah record Transaction bertipe INCOME sekaligus menambah (increment) nilai realBalance di tabel Wallet.
 */
export async function addIncome(
  title: string,
  amount: number,
  category: string,
  date?: string
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (amount <= 0) {
    throw new Error("Nominal pemasukan harus lebih dari 0");
  }

  const txDate = date ? new Date(date) : new Date();

  await prisma.$transaction(async (tx) => {
    // 1. Create INCOME transaction
    await tx.transaction.create({
      data: {
        userId: user.id,
        type: TransactionType.INCOME,
        category: category || "INCOME",
        title: title || `${category || "Top-up"} Pemasukan`,
        amount,
        transactionDate: txDate,
      },
    });

    // 2. Increment realBalance in Wallet
    await tx.wallet.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        realBalance: amount,
      },
      update: {
        realBalance: {
          increment: amount,
        },
      },
    });
  });

  revalidatePath("/");
  return { success: true };
}

/**
 * 3. addExpenseDirect: Menambah pengeluaran harian langsung ke Transaction (EXPENSE) dan mengurangi (decrement) realBalance di Wallet.
 */
export async function addExpenseDirect(
  title: string,
  amount: number,
  category: string,
  worthItRating: WorthItRating,
  date?: string,
  receiptImageUrl?: string
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (amount <= 0) {
    throw new Error("Nominal pengeluaran harus lebih dari 0");
  }

  const txDate = date ? new Date(date) : new Date();
  const prismaRating = mapRatingToPrisma(worthItRating);

  await prisma.$transaction(async (tx) => {
    // 1. Create EXPENSE transaction
    await tx.transaction.create({
      data: {
        userId: user.id,
        type: TransactionType.EXPENSE,
        category: category || "Pengeluaran",
        title: title || "Pengeluaran Langsung",
        amount,
        worthItRating: prismaRating,
        receiptImageUrl: receiptImageUrl || null,
        transactionDate: txDate,
      },
    });

    // 2. Decrement realBalance in Wallet
    await tx.wallet.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        realBalance: -amount,
      },
      update: {
        realBalance: {
          decrement: amount,
        },
      },
    });
  });

  revalidatePath("/");
  return { success: true };
}

/**
 * 4. createPlan: Menyimpan rencana baru (TO_GO, TO_BUY, atau TO_DO) ke tabel Plan dengan status DRAFT.
 * (Untuk TO_DO, estimatedCost selalu 0).
 */
export async function createPlan(data: CreatePlanInput) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const isTodo = data.category === "to-do";
  const prismaCategory = mapCategoryToPrisma(data.category);

  const plan = await prisma.plan.create({
    data: {
      userId: user.id,
      category: prismaCategory,
      subCategory: data.subCategory || "General",
      title: data.title,
      estimatedCost: isTodo ? 0 : (data.estimatedCost || 0),
      paxCount: isTodo ? 1 : (data.paxCount || 1),
      priority: isTodo && data.priority ? data.priority.toUpperCase() : null,
      referenceUrl: data.referenceUrl || null,
      imageUrl: data.imageUrl || null,
      locationName: data.locationName || null,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
      notes: data.notes || null,
      status: PlanStatus.DRAFT,
    },
  });

  revalidatePath("/");
  return { success: true, planId: plan.id };
}

/**
 * 5. completeTodoPlan: Khusus untuk kategori TO_DO, langsung mengubah status Plan menjadi COMPLETED (1-klik checkbox)
 * TANPA membuat record di Transaction dan tanpa mengubah saldo.
 */
export async function completeTodoPlan(planId: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Ensure the plan belongs to the authenticated user and toggle/complete it
  const existing = await prisma.plan.findFirst({
    where: { id: planId, userId: user.id },
  });

  if (!existing) {
    throw new Error("Rencana tidak ditemukan atau bukan milik Anda.");
  }

  // Toggle status: if COMPLETED -> DRAFT, else -> COMPLETED
  const nextStatus =
    existing.status === PlanStatus.COMPLETED
      ? PlanStatus.DRAFT
      : PlanStatus.COMPLETED;

  await prisma.plan.update({
    where: { id: planId },
    data: { status: nextStatus },
  });

  revalidatePath("/");
  return { success: true, status: nextStatus };
}

/**
 * 6. completePaidPlan: Khusus TO_GO dan TO_BUY, gunakan prisma.$transaction untuk:
 * 1) Mengubah status Plan menjadi COMPLETED,
 * 2) Membuat record baru di Transaction (EXPENSE) yang terhubung ke planId beserta worthItRating-nya,
 * 3) Mengurangi realBalance di Wallet sebesar actualAmount.
 */
export async function completePaidPlan(
  planId: string,
  actualAmount: number,
  worthItRating: WorthItRating,
  receiptImageUrl?: string
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  if (actualAmount <= 0) {
    throw new Error("Nominal pengeluaran harus lebih dari 0");
  }

  const prismaRating = mapRatingToPrisma(worthItRating);

  await prisma.$transaction(async (tx) => {
    // 1. Verify plan ownership
    const plan = await tx.plan.findFirst({
      where: { id: planId, userId: user.id },
    });

    if (!plan) {
      throw new Error("Rencana tidak ditemukan atau bukan milik Anda.");
    }

    // 2. Mark Plan as COMPLETED
    await tx.plan.update({
      where: { id: planId },
      data: { status: PlanStatus.COMPLETED },
    });

    // 3. Create linked EXPENSE transaction
    await tx.transaction.create({
      data: {
        userId: user.id,
        planId: plan.id,
        type: TransactionType.EXPENSE,
        category: plan.subCategory || "General Spend",
        title: plan.title,
        amount: actualAmount,
        worthItRating: prismaRating,
        receiptImageUrl: receiptImageUrl || plan.imageUrl || null,
        transactionDate: new Date(),
      },
    });

    // 4. Deduct realBalance in Wallet
    await tx.wallet.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        realBalance: -actualAmount,
      },
      update: {
        realBalance: {
          decrement: actualAmount,
        },
      },
    });
  });

  revalidatePath("/");
  return { success: true };
}

/**
 * 7. deletePlan: Menghapus item rencana draft jika user salah input.
 */
export async function deletePlan(planId: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.plan.findFirst({
    where: { id: planId, userId: user.id },
  });

  if (!existing) {
    throw new Error("Rencana tidak ditemukan atau bukan milik Anda.");
  }

  await prisma.plan.delete({
    where: { id: planId },
  });

  revalidatePath("/");
  return { success: true };
}

/**
 * 8. deleteTransaction: Menghapus transaksi dan mengembalikan saldo di Wallet.
 */
export async function deleteTransaction(transactionId: string) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findFirst({
      where: { id: transactionId, userId: user.id },
    });

    if (!existing) {
      throw new Error("Transaksi tidak ditemukan atau bukan milik Anda.");
    }

    // Revert balance changes in wallet
    if (existing.type === TransactionType.EXPENSE) {
      // Revert expense: give back money (increment)
      await tx.wallet.update({
        where: { userId: user.id },
        data: {
          realBalance: {
            increment: existing.amount,
          },
        },
      });
    } else if (existing.type === TransactionType.INCOME) {
      // Revert income: subtract money (decrement)
      await tx.wallet.update({
        where: { userId: user.id },
        data: {
          realBalance: {
            decrement: existing.amount,
          },
        },
      });
    }

    // Delete transaction
    await tx.transaction.delete({
      where: { id: transactionId },
    });
  });

  revalidatePath("/");
  return { success: true };
}

/**
 * 9. updateWalletBalance: Memperbarui saldo realBalance secara langsung (untuk kontrol simulator di Profile)
 */
export async function updateWalletBalance(newBalance: number) {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await prisma.wallet.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      realBalance: newBalance,
    },
    update: {
      realBalance: newBalance,
    },
  });

  revalidatePath("/");
  return { success: true };
}
