"use client";
import { Job } from "@prisma/client";
import FormSubmitButton from "@/components/FormSubmitButton";
import { useFormState } from "react-dom";
import { approveSubmission, deleteJob } from "../../actions";

interface AdminSidebarProps {
  job: Job;
}

export default function AdminSidebar({ job }: AdminSidebarProps) {
  return (
    <aside>
      {job.approved ? (
        <span>Approved</span>
      ) : (
        <ApproveSubmissionButton jobId={job.id} />
      )}
      <DeleteJobButton jobId={job.id} />
    </aside>
  );
}

interface AdmitButtonProps {
  jobId: number;
}

function ApproveSubmissionButton({ jobId }: AdmitButtonProps) {
  const [formState, formAction] = useFormState(approveSubmission, undefined);

  return (
    <form action={formAction} className="space-y-1">
      <input hidden name="jobId" value={jobId} />
      <FormSubmitButton className="w-full bg-green-500 hover:bg-green-600">
        Approve
      </FormSubmitButton>
      {formState?.error && (
        <p className="text-sm text-red-500">{formState.error} </p>
      )}
    </form>
  );
}

function DeleteJobButton({ jobId }: AdmitButtonProps) {
  const [formState, formAction] = useFormState(deleteJob, undefined);
  return (
    <form action={formAction} className="space-y-1">
      <input hidden name="jobId" value={jobId} />
      <FormSubmitButton className="w-full bg-red-500 hover:bg-red-600">
        Delete
      </FormSubmitButton>
      {formState?.error && (
        <p className="text-sm text-red-500">{formState.error} </p>
      )}
    </form>
  );
}
