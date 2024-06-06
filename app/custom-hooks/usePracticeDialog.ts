"use client";

import { useEffect, useState } from "react";
import revalidatePracticePage from "../practice/actions/revalidate-practice-page";
import { logSession } from "../practice/actions/add-session";

export type TestScore = {
  right: number;
  wrong: number;
};

export function usePracticeDialog() {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [testScore, setTestScore] = useState<TestScore>({ right: 0, wrong: 0 });
  const [open, setOpen] = useState(false);
  // the session status is controlled by the open state of the quiz dialog
  useEffect(() => {
    async function practiceDialogChange() {
      if (open) {
        setStartTime(new Date());
      } else {
        if (!startTime) return;
        await logSession(startTime, testScore);
        setTestScore({ right: 0, wrong: 0 });
        setStartTime(null);
        revalidatePracticePage();
      }
    }
    practiceDialogChange();
  }, [open]);

  function addRightAnswer() {
    setTestScore({ ...testScore, right: testScore.right + 1 });
  }

  function addWrongAnswer() {
    setTestScore({ ...testScore, wrong: testScore.wrong + 1 });
  }

  return {
    quizDialogState: {
      testScore,
      addRightAnswer,
      addWrongAnswer,
      open,
      setOpen,
    },
  };
}
