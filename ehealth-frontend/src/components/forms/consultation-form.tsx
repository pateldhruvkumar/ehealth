"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateConsultation } from "@/hooks/use-doctor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const consultationSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  visitDate: z.string().optional(),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  notes: z.string().optional(),
});

interface ConsultationFormProps {
  patientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ConsultationForm({
  patientId,
  onSuccess,
  onCancel,
}: ConsultationFormProps) {
  const createConsultation = useCreateConsultation();

  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientId,
      visitDate: new Date().toISOString().split("T")[0],
      diagnosis: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof consultationSchema>) => {
    createConsultation.mutate(
      {
        patientId: values.patientId,
        visitDate: values.visitDate ? new Date(values.visitDate) : undefined,
        diagnosis: values.diagnosis,
        notes: values.notes,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess();
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden field for patientId */}
        <input type="hidden" {...form.register("patientId")} />

        <FormField
          control={form.control}
          name="visitDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Acute Bronchitis"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinical Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Patient presented with..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={createConsultation.isPending}>
            {createConsultation.isPending ? "Saving..." : "Save Consultation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
