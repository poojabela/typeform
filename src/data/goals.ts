export const goalOptions = [
  {
    label: "Structured approach to growth",
    group: "structured-approach",
  },
  {
    label: "Build a growth team",
    group: "gwowth-team",
  },
  {
    label: "Connect with like-minded people",
    group: "connect",
  },
].map(({ label, group }) => ({
  label,
  group,
  value: label,
}));
