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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMedicalInfo } from "@/hooks/use-patient";
import { BLOOD_GROUPS } from "@/lib/constants";
import { Patient } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const medicalInfoSchema = z.object({
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(), // Comma separated
  chronicConditions: z.string().optional(), // Comma separated
});

interface MedicalInfoFormProps {
  initialData: Partial<Patient>;
}

export function MedicalInfoForm({ initialData }: MedicalInfoFormProps) {
  const updateMedicalInfo = useUpdateMedicalInfo();

  const form = useForm<z.infer<typeof medicalInfoSchema>>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: {
      bloodGroup: initialData.bloodGroup || "",
      allergies: initialData.allergies?.join(", ") || "",
      chronicConditions: initialData.chronicConditions?.join(", ") || "",
    },
  });

  const onSubmit = (values: z.infer<typeof medicalInfoSchema>) => {
    updateMedicalInfo.mutate({
      bloodGroup: values.bloodGroup,
      allergies: values.allergies
        ? values.allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      chronicConditions: values.chronicConditions
        ? values.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Peanuts, Penicillin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chronicConditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chronic Conditions (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Asthma, Diabetes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateMedicalInfo.isPending}>
          {updateMedicalInfo.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
