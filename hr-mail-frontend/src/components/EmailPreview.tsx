import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RenderedEmail {
  to: string;
  subject: string;
  plaintext: string;
  html: string;
}

interface EmailPreviewProps {
  renderedEmail: RenderedEmail;
}

export const EmailPreview = ({ renderedEmail }: EmailPreviewProps) => {
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedPlain, setCopiedPlain] = useState(false);

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

  return (
    <Card className="flex flex-col shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
      <div className="border-b p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Email Preview</h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="font-medium text-muted-foreground">To:</span>
            <span className="text-foreground">{renderedEmail.to || "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-muted-foreground">Subject:</span>
            <span className="text-foreground">{renderedEmail.subject}</span>
          </div>
        </div>
      </div>

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
