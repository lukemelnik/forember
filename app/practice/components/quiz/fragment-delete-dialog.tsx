import React from "react";
import { Fragment } from "./quiz";
import { deleteFragment } from "../../actions/flashcard-actions";
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
import TrashIcon from "@/components/trash-icon";

export default function FragmentDeleteDialog({
  fragment,
  handleDelete,
  setIsFlipped,
}: {
  fragment: Fragment;
  handleDelete: (id: string) => void;
  setIsFlipped: (value: boolean) => void;
}) {
  return (
    <div className="absolute right-3 top-5">
      <AlertDialog>
        <AlertDialogTrigger>
          <div className="text-red-600">
            <TrashIcon width="25" height="25" />
          </div>
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
              className="bg-red-400"
              onClick={(event) => {
                // deletes the fragment in the database
                event.stopPropagation();
                deleteFragment(fragment);
                // deletes the fragment in the client state
                handleDelete(fragment.id);
                setIsFlipped(false);
              }}
            >
              Delete Fragment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
