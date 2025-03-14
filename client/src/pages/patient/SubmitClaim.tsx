import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { Document } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const submitClaimSchema = z.object({
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "Amount must be a positive number" })
  ),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters" }),
  documents: z.array(z.any()).optional(),
});

type SubmitClaimFormValues = z.infer<typeof submitClaimSchema>;

const SubmitClaim = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SubmitClaimFormValues>({
    resolver: zodResolver(submitClaimSchema),
    defaultValues: {
      amount: 0,
      description: "",
      documents: [],
    },
  });

  const onSubmit = async (data: SubmitClaimFormValues) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user"));

      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to submit a claim",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Create claim data with image URLs
      const newClaim = {
        amount: data.amount,
        description: data.description,
        documents: documents.map((doc) => doc.url), // Sending only URLs to backend
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/claims`,
        newClaim,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Response", response);
      toast({
        title: "Claim submitted successfully!",
        description: "Your claim has been submitted and is pending review.",
      });
      navigate("/patient/dashboard");
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentsChange = (newDocuments: Document[]) => {
    setDocuments(newDocuments);
    form.setValue("documents", newDocuments);
  };

  const goBack = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" className="mb-6 gap-2" onClick={goBack}>
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Submit a New Claim</CardTitle>
            <CardDescription>
              Fill out the form below to submit a new claim for processing
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Claim Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the total amount you're claiming
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about your claim..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the medical service, treatment, or reason for
                        this claim
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documents"
                  render={() => (
                    <FormItem>
                      <FormLabel>Supporting Documents</FormLabel>
                      <FormControl>
                        <FileUpload
                          onFilesSelected={handleDocumentsChange}
                          existingDocuments={documents}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload receipts, prescriptions, or other relevant
                        documents
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto">
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Submit Claim"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitClaim;
