export function formatDate(
  date: Date,
  includeTime = true
) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    ...(includeTime && {
      timeStyle: "medium",
    }),
  }).format(date);
}