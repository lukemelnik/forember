"use client";
import MagicWandIcon from "@/components/magic-wand-icon";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import EditableFragment from "../components/editable-fragment";
import { toast } from "sonner";
import revalidatePracticePage from "../actions/revalidate-practice-page";
import GenerateInstructionsButton from "../components/create/generate-instructions-button";
import GenerateLoadingSkeleton from "../components/create/generate-loading-skeleton";
import CarouselContainer from "../components/create/carousel-container";
import { useGenerateFragments } from "@/app/custom-hooks/useGenerateFragments";
import CreateFragmentsForm from "../components/create/create-fragments-form";

// generated fragments are given a simple temporary id for displaying to the user that will be replaced when its saved in the db
export type TemporaryFragment = {
  id: string;
  question: string;
  answer: string;
};

export default function AIPage() {
  // custom hook for fetching fragments from the ai model
  const {
    fragments,
    setFragments,
    setLoading,
    loading,
    setFetchError,
    fetchError,
    fetchFragments,
    removeFragment,
    saveFragment,
  } = useGenerateFragments();
  let fragmentCount = fragments.length;

  return (
    <div className="max-w-2xl md:ml-20 md:mt-16">
      <h1 className="mb-3">Generate Fragments with AI</h1>
      <GenerateInstructionsButton />
      {loading && <GenerateLoadingSkeleton />}
      {fragments && fragments.length > 0 && (
        <CarouselContainer fragmentCount={fragmentCount}>
          <Carousel className="mt-4 w-[350px] rounded-xl border-2 border-zinc-300 p-5 md:w-full">
            <CarouselContent>
              {fragments.map((fragment) => (
                <CarouselItem key={fragment.question}>
                  <EditableFragment
                    fragment={fragment}
                    handleRemoveFragment={removeFragment}
                    handleSaveFragment={saveFragment}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-black" />
            <CarouselNext className="text-black" />
          </Carousel>
        </CarouselContainer>
      )}
      <CreateFragmentsForm
        fetchError={fetchError}
        loading={loading}
        fetchFragments={fetchFragments}
      />
    </div>
  );
}
