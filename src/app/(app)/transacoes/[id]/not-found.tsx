import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

/** Exibido quando a página chama notFound() (id inválido, inexistente ou de outro usuário) */
export default function TransactionNotFound() {
  return (
    <Card className="mx-auto max-w-lg">
      <EmptyState
        icon={SearchX}
        title="Transação não encontrada"
        description="Ela pode ter sido excluída ou o endereço está incorreto."
      >
        <Button asChild>
          <Link href="/transacoes">Ver minhas transações</Link>
        </Button>
      </EmptyState>
    </Card>
  );
}
