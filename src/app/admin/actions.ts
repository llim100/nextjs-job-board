"use server";

import { currentUser } from "@clerk/nextjs";
import { isAdmin } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";

type Formstate = { error?: string } | undefined;

export async function approveSubmission(
  prevState: Formstate,
  formData: FormData,
): Promise<Formstate> {
  try {
    const jobId = parseInt(formData.get("jobId") as string);
    const user = await currentUser();

    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized");
    }
    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
}

export async function deleteJob(
  prevState: Formstate,
  formData: FormData,
): Promise<Formstate> {
  try {
    const jobId = await parseInt(formData.get("jobId") as string);
    const user = await currentUser();
    if (!user || !isAdmin(user)) {
      throw new Error("Not authorized");
    }
    const job = await prisma?.job.findUnique({
      where: { id: jobId },
    });
    if (job?.companyLogoUrl) {
      await del(job.companyLogoUrl);
    }
    await prisma.job.delete({
      where: { id: jobId },
    });
    revalidatePath("/");
  } catch (error) {
    let message = "Unexpected error";
    if (error instanceof Error) {
      message = error.message;
    }
    return { error: message };
  }
  redirect("/admin");
}

//revalidatePath() - to purge cached data for a route/page; the next time you visit the path, it has fresh data.
//ie, revalidatePath('/user/johndoe) to invalidate this path, so next time it is visited it has fresh data
//revalidatePath('/') for homepage refresh

//redirect() should be outside of try/catch block

//server actions that are called in the front-end, handle error in FE code
