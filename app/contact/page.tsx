import type { Metadata } from "next";
import { ContactForm } from "./contact-client";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "QuizNaviへのお問い合わせはこちらから。",
};

export default function ContactPage() {
  return <ContactForm />;
}
