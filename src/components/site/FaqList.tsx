import { FAQ } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqList({ limit }: { limit?: number }) {
  const { tr } = useI18n();
  const items = limit ? FAQ.slice(0, limit) : FAQ;
  return (
    <Accordion type="single" collapsible className="space-y-3">
      {items.map((f, i) => (
        <AccordionItem
          key={i}
          value={`q-${i}`}
          className="bg-white rounded-xl border border-river/10 px-6"
        >
          <AccordionTrigger className="font-serif text-lg text-river text-left hover:no-underline">
            {tr(f.q)}
          </AccordionTrigger>
          <AccordionContent className="text-cliff leading-relaxed">
            {tr(f.r)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
