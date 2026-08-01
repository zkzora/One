import { Register } from "@/generated/register";

export const metadata = {
  title: "Register an agent",
  description:
    "Five fields, one transaction. No approval queue, no listing fee, and no token.",
};

export default function Page() {
  return <Register />;
}
