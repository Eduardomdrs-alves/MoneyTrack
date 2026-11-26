import type {
  ApiErrorBody,
  Category,
  Transaction,
  TransactionFilters,
  TransactionInput,
  TransactionType,
} from "@/types";

/**
 * Cliente HTTP tipado usado pelos hooks do React Query (lado do cliente).
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (response.status === 204) return undefined as T;

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorBody = (body ?? {}) as Partial<ApiErrorBody>;
    throw new ApiError(
      errorBody.error ?? "Não foi possível completar a operação.",
      response.status,
      errorBody.fieldErrors,
    );
  }

  return body as T;
}

type ListFilters = Omit<TransactionFilters, "search">;

export const transactionsApi = {
  list(filters: ListFilters) {
    const params = new URLSearchParams({
      month: filters.month,
      type: filters.type,
      categoryId: filters.categoryId,
    });
    return request<Transaction[]>(`/api/transactions?${params.toString()}`);
  },
  get(id: string) {
    return request<Transaction>(`/api/transactions/${id}`);
  },
  create(input: TransactionInput) {
    return request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  update(id: string, input: TransactionInput) {
    return request<Transaction>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },
  remove(id: string) {
    return request<void>(`/api/transactions/${id}`, { method: "DELETE" });
  },
};

export const categoriesApi = {
  list(type?: TransactionType) {
    return request<Category[]>(type ? `/api/categories?type=${type}` : "/api/categories");
  },
};
