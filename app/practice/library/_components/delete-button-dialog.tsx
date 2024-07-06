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
import React from "react";
import { Fragment } from "../../components/quiz/quiz";
import { deleteFragment } from "../_actions/actions";
import { toast } from "sonner";

export default function DeleteButtonDialog({
  fragment,
  clearSearchData,
}: {
  fragment: Fragment;
  clearSearchData?: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-600">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the fragment from the knowledge base.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600"
            onClick={async (event) => {
              event.stopPropagation();

              // deletes the fragment in the database
              const result = await deleteFragment(fragment);
              if (!result.success) {
                toast(result.message, { duration: 2000 });
                return;
              } else {
                toast(result.message, { duration: 2000 });
                // force the library page to refectch the data so the deleted fragment doesn't persist
                if (clearSearchData) {
                  clearSearchData();
                }
              }
            }}
          >
            Delete Fragment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
