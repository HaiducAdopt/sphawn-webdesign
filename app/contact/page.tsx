import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | Sphawn Webdesign Heerlen",
  description:
    "Neem contact op voor een offerte of kennismakingsgesprek. Ik reageer binnen 24 uur. Of mail direct naar support@sphawn.nl.",
};

export default function ContactPage() {
  return <ContactClient />;
}
