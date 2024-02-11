"use client";
import { CreateJobValues, createJobSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import H1 from "@/components/ui/h1";
import { Input } from "@/components/ui/input";
import LocationInput from "@/components/LocationInput";
import Select from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { jobTypes, locationTypes } from "@/lib/job-types";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import RichTextEditor from "@/components/RichTextEditor";
import { draftToMarkdown } from "markdown-draft-js";
import LoadingButton from "@/components/LoadingButton";
import { createJobPosting } from "./actions";

const NewJobForm = () => {
  const form = useForm<CreateJobValues>({
    resolver: zodResolver(createJobSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form; //destructure form

  async function onSubmit(values: CreateJobValues) {
    //alert(JSON.stringify(values, null, 2));
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    try {
      await createJobPosting(formData);
    } catch (error) {
      alert("Something went wrong, try again");
    }
  }
  //catch error even though you don't expect it; else input placed will be lost

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Find your perfect developer</H1>
        <p className="text-muted-foreground">
          Get your job posting seen by thousands of job seekers
        </p>
      </div>
      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Job details</h2>
          <p className="text-muted-foreground">
            Provide a job description and details
          </p>
        </div>
        <Form {...form}>
          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job types</FormLabel>
                  <FormControl>
                    <Select {...field} defaultValue="">
                      <option value="" hidden>
                        Select an option
                      </option>
                      {jobTypes.map((jobType) => (
                        <option key={jobType} value={jobType}>
                          {jobType}{" "}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="companyLogo"
              render={({ field: { value, ...fieldValues } }) => (
                <FormItem>
                  <FormLabel>Company logo</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue=""
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.currentTarget.value === "Remote") {
                          trigger("location");
                        }
                      }}
                    >
                      <option value="" hidden>
                        Select an option
                      </option>
                      {locationTypes.map((locationType) => (
                        <option key={locationType} value={locationType}>
                          {locationType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <LocationInput
                      onLocationSelected={field.onChange}
                      ref={field.ref}
                    />
                  </FormControl>
                  {watch("location") && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setValue("location", "", { shouldValidate: true });
                        }}
                      >
                        <X size={20} />
                      </button>
                      <span className="text-sm">{watch("location")}</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="applicationEmail">How to apply</Label>
              <div className="flex justify-between">
                <FormField
                  control={control}
                  name="applicationEmail"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            id="applicationEmail"
                            placeholder="Email type"
                            type="email"
                            {...field}
                          />
                          <span className="mx-2">or</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="applicationUrl"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <Input
                          placeholder="Website"
                          type="url"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            trigger("applicationEmail");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label onClick={() => setFocus("description")}>
                    Description
                  </Label>
                  <FormControl>
                    <RichTextEditor
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
};
export default NewJobForm;

//LocationInput. We don't store its input in RHF, we call onChange when onLocationSelected is called
//we also put ref, w/c we will pass to forwardRef in LocationInput
//we only need ref and onChange for LocationInput, so we do not spread the remaining field values

//Below LocationInput, we want to show the current selected city. The current values of the control fields in the form
//can be obtained from the watch function.
// to quickly test it, below the form control, {watch('location) && watch('location)} //to render the value
//now change the second expression to a UI (button etc)
// show a button of type button (b/c we are inside a form, else if it is submit, form might think that we want to
//submit the form ). when we click the button/X, we remove the current location by passing ''
//setValue (part of form), pass the field, string, and configuration (here shouldValidate, so validation for the
//validation field runs again)

//trigger('') //for validation;

{
  /* <div className="space-y-2">
<Label htmlFor="applicationEmail">How to apply</Label>
<div className="flex justify-between">
  <FormField
    control={control}
    name="applicationEmail"
    render={({ field }) => (
      <FormItem className="grow">
        <FormControl>
          <div className="flex items-center">
            <Input
              id="applicationEmail"
              placeholder="Email"
              type="email"
              {...field}
            />
            <span className="mx-2">or</span>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={control}
    name="applicationUrl"
    render={({ field }) => (
      <FormItem className="grow">
        <FormControl>
          <Input
            placeholder="Website"
            type="url"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              trigger("applicationEmail");
            }}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>
</div>
<FormField
control={control}
name="description"
render={({ field }) => (
  <FormItem>
    <Label onClick={() => setFocus("description")}>
      Description
    </Label>
    <FormControl>
      <RichTextEditor
        onChange={(draft) =>
          field.onChange(draftToMarkdown(draft))
        }
        ref={field.ref}
      />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>
<FormField
control={control}
name="salary"
render={({ field }) => (
  <FormItem>
    <FormLabel>Salary</FormLabel>
    <FormControl>
      <Input {...field} type="number" />
    </FormControl>
    <FormMessage />
  </FormItem>
)}
/>
<LoadingButton type="submit" loading={isSubmitting}>
Submit
</LoadingButton> */
}
