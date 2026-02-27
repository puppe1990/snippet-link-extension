import { redirect } from "next/navigation";
import { getDefaultLocaleFromEnv } from "@/i18n/config";

export default function RootRedirectPage() {
  redirect(`/${getDefaultLocaleFromEnv()}`);
}
