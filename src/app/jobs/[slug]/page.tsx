import { notFound } from "next/navigation";
import { cache } from "react";
import JobPage from "@/components/JobPage";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: { slug: string };
}

const getJob = cache(async (slug: string) => {
  const job = await prisma.job.findUnique({
    where: { slug },
  });
  if (!job) notFound();
  return job;
});
//use cache if you call a function more than once; react will cache the function and
//will cache it; fetch, calls are automatically deduplicated

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({
    where: { approved: true },
    select: { slug: true },
  });
  return jobs.map(({ slug }) => slug); //to array of strings
}

//if page has dynamic params, static caching is disabled as it does not know in advanc what slug is
//static caching is done at compile time and fetched at runtime
//with generateStaticParams() above, the array of slug is generated that allows static caching of the pages

export async function generateMetadata({
  params: { slug },
}: PageProps): Promise<Metadata> {
  const job = await getJob(slug);
  return { title: job?.title };
}
//in app router, you can't share data between the main function and
//generateMetadata(); need to get it from db again

export default async function Page({ params: { slug } }: PageProps) {
  const job = await getJob(slug);

  const { applicationEmail, applicationUrl } = job;

  const applicationLink = applicationEmail
    ? `mailto:${applicationEmail}`
    : applicationUrl;
  if (!applicationLink) {
    console.error("job has no application link or email");
    notFound();
  }

  return (
    <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
      <JobPage job={job} />
      <aside>
        <Button asChild>
          <a href={applicationLink} className="w-40 md:w-fit">
            Apply now
          </a>
        </Button>
      </aside>
    </main>
  );
}

//asChild property is used to delegate rendering of a component to its single child element; in the example
//above, the Link component (its single child element) is used to render a Button component
