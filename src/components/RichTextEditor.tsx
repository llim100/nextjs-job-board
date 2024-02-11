"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { cn } from "@/lib/utils";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false },
);

export default forwardRef<Object, EditorProps>(
  function RichTextEditor(props, ref) {
    return (
      <Editor
        editorClassName={cn(
          "border rounded-md px-3 min-h-[150px] cursor-text ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          props.editorClassName,
        )}
        toolbar={{
          options: ["inline", "list", "link", "history"],
          inline: {
            options: ["bold", "italic", "underline"],
          },
        }}
        editorRef={(r) => {
          if (typeof ref === "function") {
            ref(r);
          } else if (ref) {
            ref.current = r;
          }
        }}
        {...props}
      />
    );
  },
);

// function RichTextEditor(props, ref) {
//   return <Editor {...props} />;
// },

//"react-draft-wysiwyg/dist/react-draft-wysiwyg.css" is the css that comes with
//the library and applies styling to the RTE

//next customize the RTE
//editorClassName: This is the class name that will be applied to the editor element. You can use this to style the editor with CSS.
//use cn so can still pass styling from outside

//next customize what we see in the toolbar. Configure the toolbar prop. Put an array in options what you want
//to include, and further, ie, in inline the options you want to include the ones you only need

//next we have to assign the ref, normally: ref = {ref}
//but EditorProps here does not have a ref; it has editorRef, you can't just do: editorRef = {ref}
//instead it received a callback function that assigns the reference of Editor to the ref parameter of RTE;
//but ref can be either of type function or type of object
//error:  ReferenceError: window is not defined. It has to render the editor in the server in nextjs, but here it is only
//rendered in the client.
//we remove th import {Editor} from ...; and import it dynamically -> executed only in the client

//editorRef allows you to access the underlying editor instance, ie to
//call methods or access properties not exposed by react-draft-wysiwyg;
//to use editorRef, you pass it a callback function that receives the editor instance as an argument
