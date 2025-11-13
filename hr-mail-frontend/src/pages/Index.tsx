import { useState } from "react";
import { EmailForm } from "@/components/EmailForm";
import { EmailPreview } from "@/components/EmailPreview";
import { renderEmail } from "@/lib/emailTemplates";
import { Mail } from "lucide-react";

export interface EmailData {
  to: string;
  NAME: string;
  EMAIL: string;
  TYPE: string;
  POSITION?: string;
  DATE?: string;
  TIME?: string;
  MODE?: string;
  DEADLINE?: string;
  COMPANY: string;
  ADDITIONAL_NOTES?: string;
  ATTACHMENTS?: File[];
}

const Index = () => {
  const [emailData, setEmailData] = useState<EmailData>({
    to: "",
    NAME: "",
    EMAIL: "",
    TYPE: "SHORTLISTED",
    COMPANY: "Arinova Studio",
  });

  const renderedEmail = renderEmail(emailData);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">HR Email Automation</h1>
              <p className="text-sm text-muted-foreground">Generate professional HR emails instantly</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <EmailForm emailData={emailData} setEmailData={setEmailData} />
          <EmailPreview renderedEmail={renderedEmail} />
        </div>
      </main>
    </div>
  );
};

export default Index;
