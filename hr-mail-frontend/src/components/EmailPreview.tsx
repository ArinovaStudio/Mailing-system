import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface RenderedEmail {
  to: string;
  subject: string;
  plaintext: string;
  html: string;
  ATTACHMENTS?: File[];
}

interface EmailPreviewProps {
  renderedEmail: RenderedEmail;
}

export const EmailPreview = ({ renderedEmail }: EmailPreviewProps) => {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedPlain, setCopiedPlain] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const copyToClipboard = async (text: string, type: "html" | "plain") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "html") {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else {
        setCopiedPlain(true);
        setTimeout(() => setCopiedPlain(false), 2000);
      }
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    toast.info("Sending email...");

    try {
      const formData = new FormData();
      formData.append("to", renderedEmail.to);
      formData.append("subject", renderedEmail.subject);
      formData.append("plaintext", renderedEmail.plaintext);
      formData.append("html", renderedEmail.html);

      // ✅ Attach single file if present
      if (renderedEmail.ATTACHMENTS && renderedEmail.ATTACHMENTS.length > 0) {
        formData.append("file", renderedEmail.ATTACHMENTS[0]);
        console.log("File appended:", renderedEmail.ATTACHMENTS[0].name);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/mail/send`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("res = ", response.data);
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    console.log("rendered email = ", renderedEmail);
  }, [renderedEmail]);

  return (
    <Card className="flex flex-col shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)] relative">
      {/* Header section with Send button on the top-right */}
      <div className="border-b p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Email Preview
          </h2>
          <div className="space-y-2 text-sm mt-2">
            <div className="flex gap-2">
              <span className="font-medium text-muted-foreground">To:</span>
              <span className="text-foreground">{renderedEmail.to || "—"}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-medium text-muted-foreground">
                Subject:
              </span>
              <span className="text-foreground">
                {renderedEmail.subject || "—"}
              </span>
            </div>
            {renderedEmail.ATTACHMENTS &&
              renderedEmail.ATTACHMENTS.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Attachments:
                  </span>
                  {renderedEmail.ATTACHMENTS.map((file, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted rounded-md border border-border flex items-center gap-1"
                    >
                      📎 {file.name}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* ✅ Send Email Button */}
        <Button
          onClick={handleSendEmail}
          disabled={isSending}
          className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all duration-200 ${
            isSending ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Email"
          )}
        </Button>
      </div>

      {/* Tabs and Preview Section */}
      <Tabs defaultValue="html" className="flex flex-1 flex-col">
        <TabsList className="mx-6 mt-4 grid w-auto grid-cols-2">
          <TabsTrigger value="html">HTML Preview</TabsTrigger>
          <TabsTrigger value="plain">Plain Text</TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="flex-1 p-6 pt-4">
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="absolute right-2 top-2 z-10"
              onClick={() => copyToClipboard(renderedEmail.html, "html")}
            >
              {copiedHtml ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy HTML
                </>
              )}
            </Button>
            <div
              className="min-h-[400px] rounded-lg border bg-card p-6"
              dangerouslySetInnerHTML={{ __html: renderedEmail.html }}
            />
          </div>
        </TabsContent>

        <TabsContent value="plain" className="flex-1 p-6 pt-4">
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="absolute right-2 top-2 z-10"
              onClick={() => copyToClipboard(renderedEmail.plaintext, "plain")}
            >
              {copiedPlain ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Text
                </>
              )}
            </Button>
            <pre className="min-h-[400px] whitespace-pre-wrap rounded-lg border bg-muted/50 p-6 text-sm text-foreground">
              {renderedEmail.plaintext}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
