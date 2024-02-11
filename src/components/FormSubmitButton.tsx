"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";

const FormSubmitButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  const { pending } = useFormStatus();
  return <LoadingButton {...props} type="submit" loading={pending} />;
};
export default FormSubmitButton;

// const FormSubmitButton = (
//   props: React.ButtonHTMLAttributes<HTMLButtonElement>,
// ) => {
//   const { pending } = useFormStatus();
//   return (
//     <Button {...props} type="submit" disabled={props.disabled || pending}>
//       <span className="flex items-center justify-center gap-1">
//         {pending && <Loader2 size={16} className="animate-spin" />}{" "}
//         {props.children}
//       </span>
//     </Button>
//   );
// };
// export default FormSubmitButton;
