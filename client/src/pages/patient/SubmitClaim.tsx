
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import { Document } from '@/lib/types';
import { addClaim, getCurrentUser } from '@/lib/mockData';
import { useToast } from "@/hooks/use-toast";

const submitClaimSchema = z.object({
  amount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: "Amount must be a positive number" })
  ),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  documents: z.array(z.any()).optional(),
});

type SubmitClaimFormValues = z.infer<typeof submitClaimSchema>;

const SubmitClaim = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<SubmitClaimFormValues>({
    resolver: zodResolver(submitClaimSchema),
    defaultValues: {
      amount: undefined,
      description: "",
      documents: [],
    },
  });
  
  const onSubmit = (data: SubmitClaimFormValues) => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a claim",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Create a new claim
    const newClaim = addClaim({
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      amount: data.amount,
      description: data.description,
      status: 'pending',
      documents,
    });
    
    // Show success toast
    toast({
      title: "Claim submitted successfully!",
      description: "Your claim has been submitted and is pending review.",
    });
    
    // Navigate back to the dashboard
    navigate('/patient/dashboard');
  };
  
  const handleDocumentsChange = (newDocuments: Document[]) => {
    setDocuments(newDocuments);
    form.setValue('documents', newDocuments);
  };
  
  const goBack = () => {
    navigate('/patient/dashboard');
  };

  return (
    <div className="container py-8 animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2"
        onClick={goBack}
      >
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        Describe the medical service, treatment, or reason for this claim
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
                        Upload receipts, prescriptions, or other relevant documents
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                  <Button type="submit" className="w-full md:w-auto">
                    Submit Claim
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
