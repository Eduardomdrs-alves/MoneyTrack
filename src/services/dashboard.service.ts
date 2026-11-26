import "server-only";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { monthRange, shiftMonth } from "@/lib/format";
import { Category as CategoryModel } from "@/models/Category";
import { Transaction as TransactionModel } from "@/models/Transaction";
import type { ICategory } from "@/models/Category";
import type { CategoryTotal, DashboardSummary, MonthlyTotal, TransactionType } from "@/types";
import { roundMoney, toTransactionDTO } from "@/services/mappers";

const MONTHS_IN_CHART = 6;

/**
 * Monta o resumo do dashboard usando o Aggregation Framework do MongoDB:
 * os totais são calculados no banco, e não em memória.
 */
export async function getDashboardSummary(userId: string, month: string): Promise<DashboardSummary> {
  await connectDB();

  const uid = new Types.ObjectId(userId);
  const { start, end } = monthRange(month);
  const chartStart = monthRange(shiftMonth(month, -(MONTHS_IN_CHART - 1))).start;

  const [totals, byCategory, monthlyRaw, recentDocs] = await Promise.all([
    // 1. Receitas x despesas do mês selecionado
    TransactionModel.aggregate<{ _id: TransactionType; total: number; count: number }>([
      { $match: { userId: uid, date: { $gte: start, $lt: end } } },
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),

    // 2. Despesas do mês agrupadas por categoria
    TransactionModel.aggregate<{ _id: Types.ObjectId; total: number; category?: ICategory }>([
      { $match: { userId: uid, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      {
        $lookup: {
          from: CategoryModel.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    ]),

    // 3. Evolução dos últimos meses (para o gráfico de barras)
    TransactionModel.aggregate<{ _id: { month: string; type: TransactionType }; total: number }>([
      { $match: { userId: uid, date: { $gte: chartStart, $lt: end } } },
      {
        $group: {
          _id: {
            month: { $dateToString: { format: "%Y-%m", date: "$date" } },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]),

    // 4. Últimas transações do mês
    TransactionModel.find({ userId: uid, date: { $gte: start, $lt: end } })
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate<{ category: ICategory | null }>("category")
      .lean(),
  ]);

  const income = roundMoney(totals.find((t) => t._id === "income")?.total ?? 0);
  const expense = roundMoney(totals.find((t) => t._id === "expense")?.total ?? 0);
  const transactionCount = totals.reduce((sum, t) => sum + t.count, 0);

  const expensesByCategory: CategoryTotal[] = byCategory.map((item) => ({
    categoryId: item._id.toString(),
    name: item.category?.name ?? "Sem categoria",
    color: item.category?.color ?? "#64748b",
    total: roundMoney(item.total),
  }));

  // Preenche meses sem lançamentos com zero para o gráfico ficar contínuo
  const monthly: MonthlyTotal[] = Array.from({ length: MONTHS_IN_CHART }, (_, index) => {
    const m = shiftMonth(month, index - (MONTHS_IN_CHART - 1));
    const find = (type: TransactionType) =>
      roundMoney(monthlyRaw.find((r) => r._id.month === m && r._id.type === type)?.total ?? 0);
    return { month: m, income: find("income"), expense: find("expense") };
  });

  return {
    month,
    income,
    expense,
    balance: roundMoney(income - expense),
    transactionCount,
    expensesByCategory,
    monthly,
    recent: recentDocs.map(toTransactionDTO),
  };
}
