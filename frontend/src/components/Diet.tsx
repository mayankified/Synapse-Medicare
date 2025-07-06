import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";


const dietFormSchema = z.object({
  diseaseName: z.string().min(1, "Please enter the disease name"),
  condition: z
    .string()
    .min(1, "Please enter a brief description of the condition"),
  specialInstructions: z.string().optional(),
  cuisine: z.string().optional(),
  region: z.string().optional(),
});

type DietFormValues = z.infer<typeof dietFormSchema>;

export default function DietPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<any>(null);

  
  const form = useForm<DietFormValues>({
    resolver: zodResolver(dietFormSchema),
    defaultValues: {
      diseaseName: "",
      condition: "",
      specialInstructions: "",
      cuisine: "",
      region: "",
    },
  });

  
  async function onSubmit(values: DietFormValues) {
    setIsLoading(true);
    setDietPlan(null);

    
    const extraInstructions = [
      values.specialInstructions,
      values.cuisine ? `Preferred Cuisine: ${values.cuisine}` : "",
      values.region ? `Region: ${values.region}` : "",
    ]
      .filter(Boolean)
      .join(". "); 

    
    const payload = {
      disease_name: values.diseaseName,
      condition: values.condition,
      special_instructions: extraInstructions, 
    };

    try {
      
      const response = await fetch("http://127.0.0.1:8000/diet-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error("Failed to fetch diet plan");
      }

      
      const data = await response.json();
      setDietPlan(data);
    } catch (error) {
      console.error("Error fetching diet plan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>AI Dietician</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="diseaseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disease Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Diabetes, Hypertension"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Type 2, on medication"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Cuisine</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Punjabi, Chinese" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., South India, North India, Bengal.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Avoid sugar, lactose intolerance, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Diet Plan...
                  </>
                ) : (
                  "Get Diet Plan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      
      {dietPlan && (
        <Card>
          <CardHeader>
            <CardTitle>7-Day Diet Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">
                  Condition: {dietPlan.condition}
                </h3>
                <Badge variant="secondary">
                  Disease: {dietPlan.disease_name}
                </Badge>
                {dietPlan.special_instructions ? (
                  <p className="mt-1 text-sm">
                    Restrictions: {dietPlan.special_instructions}
                  </p>
                ) : null}
              </div>

              <div className="rounded-md p-4 border">
                <p className="whitespace-pre-wrap">{dietPlan.diet_plan}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
