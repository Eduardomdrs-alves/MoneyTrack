/** Mensagem de erro de validação abaixo de um campo */
export function FieldError({ id, messages }: { id?: string; messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p id={id} role="alert" className="text-xs font-medium text-destructive">
      {messages[0]}
    </p>
  );
}
