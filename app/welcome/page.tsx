import { redirect } from "next/navigation";

export default function LegacyWelcomePage() {
  redirect("/web/welcome");
}
