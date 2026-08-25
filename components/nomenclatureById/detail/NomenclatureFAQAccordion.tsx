'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface NomenclatureFAQAccordionProps {
  items: [string, string][]
}

export function NomenclatureFAQAccordion({
  items,
}: NomenclatureFAQAccordionProps) {
  return (
    <Accordion defaultValue="faq-0" className="grid gap-4 lg:grid-cols-2">
      {items.map(([question, answer], index) => (
        <AccordionItem
          key={question}
          value={`faq-${index}`}
          className="rounded-xl bg-card px-5 shadow-sm ring-1 ring-foreground/10"
        >
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
