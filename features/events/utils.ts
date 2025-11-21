export const formatEventDate = (input: string) =>
  new Date(input).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
