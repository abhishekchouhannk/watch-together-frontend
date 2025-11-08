import { redirect } from "next/navigation";

export default function ForgotPasswordRedirect() {
  redirect("/auth?mode=forgotPassword");
}
