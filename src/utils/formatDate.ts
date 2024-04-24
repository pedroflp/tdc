export function formatDate(date: string | Date) { 
  return Intl.DateTimeFormat('pt-BR', {}).format(new Date(date));
}