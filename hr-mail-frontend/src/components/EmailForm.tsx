import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmailData } from "@/pages/Index";

interface EmailFormProps {
  emailData: EmailData;
  setEmailData: (data: EmailData) => void;
}

const EMAIL_TYPES = [
  { value: "SHORTLISTED", label: "Shortlisted Notification" },
  { value: "INTERVIEW TIMING", label: "Interview Schedule" },
  { value: "ASK DETAILS", label: "Request Additional Details" },
  { value: "PROVIDE", label: "Document Submission" },
  { value: "LETTERS", label: "Offer/Joining Letter" },
];

export const EmailForm = ({ emailData, setEmailData }: EmailFormProps) => {
  const updateField = (field: keyof EmailData, value: string | File[]) => {
    setEmailData({ ...emailData, [field]: value });
  };

  const showPositionField = ["INTERVIEW TIMING", "LETTERS"].includes(
    emailData.TYPE
  );
  const showInterviewFields = emailData.TYPE === "INTERVIEW TIMING";
  const showDeadlineField = emailData.TYPE === "PROVIDE";
  const showAttachmentField = ["PROVIDE", "LETTERS"].includes(emailData.TYPE);

  return (
    <Card className="p-6 shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]">
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Email Details
      </h2>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="type">Email Type *</Label>
          <Select
            value={emailData.TYPE}
            onValueChange={(value) => updateField("TYPE", value)}
          >
            <SelectTrigger
              id="type"
              className="transition-[var(--transition-smooth)]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Candidate Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Asha Patel"
              value={emailData.NAME}
              onChange={(e) => updateField("NAME", e.target.value)}
              className="transition-[var(--transition-smooth)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="applicant@example.com"
              value={emailData.EMAIL}
              onChange={(e) => {
                const value = e.target.value;
                setEmailData({ ...emailData, EMAIL: value, to: value });
              }}
              className="transition-[var(--transition-smooth)]"
            />
          </div>
        </div>

        {showPositionField && (
          <div className="space-y-2">
            <Label htmlFor="position">
              Position {showPositionField && "*"}
            </Label>
            <Input
              id="position"
              placeholder="e.g., Software Engineer"
              value={emailData.POSITION || ""}
              onChange={(e) => updateField("POSITION", e.target.value)}
              className="transition-[var(--transition-smooth)]"
            />
          </div>
        )}

        {showInterviewFields && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Interview Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={emailData.DATE || ""}
                  onChange={(e) => updateField("DATE", e.target.value)}
                  className="transition-[var(--transition-smooth)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Interview Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={emailData.TIME || ""}
                  onChange={(e) => updateField("TIME", e.target.value)}
                  className="transition-[var(--transition-smooth)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Interview Mode *</Label>
              <Select
                value={emailData.MODE || ""}
                onValueChange={(value) => updateField("MODE", value)}
              >
                <SelectTrigger
                  id="mode"
                  className="transition-[var(--transition-smooth)]"
                >
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {showDeadlineField && (
          <div className="space-y-2">
            <Label htmlFor="deadline">Submission Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              value={emailData.DEADLINE || ""}
              onChange={(e) => updateField("DEADLINE", e.target.value)}
              className="transition-[var(--transition-smooth)]"
            />
          </div>
        )}

        {showAttachmentField && (
          <div className="space-y-2">
            <Label htmlFor="attachments">Attach Documents</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) =>
                updateField("ATTACHMENTS", Array.from(e.target.files || []))
              }
              className="transition-[var(--transition-smooth)]"
            />
            {emailData.ATTACHMENTS && emailData.ATTACHMENTS.length > 0 && (
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                {emailData.ATTACHMENTS.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-muted/30 px-3 py-1 rounded-md"
                  >
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = emailData.ATTACHMENTS?.filter(
                          (_, idx) => idx !== i
                        );
                        updateField("ATTACHMENTS", newFiles);
                      }}
                      className="text-red-500 hover:text-red-600 text-xs font-medium"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes</Label>
          <Input
            id="notes"
            placeholder="Any custom message or details"
            value={emailData.ADDITIONAL_NOTES || ""}
            onChange={(e) => updateField("ADDITIONAL_NOTES", e.target.value)}
            className="transition-[var(--transition-smooth)]"
          />
        </div>
      </div>
    </Card>
  );
};
