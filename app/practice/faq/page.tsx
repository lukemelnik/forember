import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="max-w-2xl">
      <h1>Frequently Asked Questions:</h1>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How does it work?</AccordionTrigger>
          <AccordionContent>
            With Forember you can turn fleeting notes into lasting knowledge.
            You upload your notes, we transform them into memory-boosting
            questions using spaced repetition. Spend just 20 minutes a day, and
            remember up to 85% more of what you learn.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What's spaced repetition?</AccordionTrigger>
          <AccordionContent>
            Spaced repetition: A cognitive technique enhancing memory retention
            through strategically spaced review sessions. It capitalizes on the
            psychological spacing effect, gradually lengthening intervals
            between reviews to reinforce learning and combat forgetting.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What is active recall?</AccordionTrigger>
          <AccordionContent>
            Active recall: A proven learning strategy centered around actively
            retrieving information from memory. Rather than passive review, it
            engages learners in actively answering questions or recalling
            material, fostering deeper understanding and retention.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
