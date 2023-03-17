"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AlertDialogCopyLink({ url }: { url: string }) {
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copy this Chat to clipboard</AlertDialogTitle>
          <AlertDialogDescription>
            Share it with your friends
          </AlertDialogDescription>
          {/* {!hasCopied ? (
            <Button
              onClick={() => {
                navigator.clipboard.writeText(url);
                setHasCopied(true);
              }}
            >
              Copy
            </Button>
          ) : (
            <span>Thanks for sharing Sitesmind</span>
          )} */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              console.log("cancel");
              navigator.clipboard.writeText(url);
              console.log("copied", url);
            }}
          >
            Copy
          </AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
