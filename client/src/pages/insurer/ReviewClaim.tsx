import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Claim } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { StatusBadge } from "@/components/StatusBadge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { observer } from "mobx-react-lite";
import axios from "axios";

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  approvedAmount: z.preprocess(
    (a) => (typeof a === "string" && a.trim() === "" ? undefined : Number(a)),
    z.number().positive().optional()
  ),
  comments: z.string().min(1, { message: "Comments are required" }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ReviewClaim = observer(() => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { claimId } = useParams();
  const { toast } = useToast();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: "approved",
      approvedAmount: undefined,
      comments: "",
    },
  });

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/claims`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const allClaims = response.data.data;
        const foundClaim = allClaims.find(
          (c: { _id: string }) => c._id === claimId
        );
        if (foundClaim) {
          setClaim(foundClaim);
          // Pre-fill form if claim was already reviewed
          if (foundClaim.status !== "pending") {
            form.setValue(
              "status",
              foundClaim.status as "approved" | "rejected"
            );
            if (foundClaim.approvedAmount) {
              form.setValue("approvedAmount", foundClaim.approvedAmount);
            }
            if (foundClaim.comments) {
              form.setValue("comments", foundClaim.comments);
            }
          } else {
            // For new reviews, default approved amount to the claimed amount
            form.setValue("approvedAmount", foundClaim.amount);
          }
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchClaims();
  }, [claimId, form]);

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);
    try {
      if (!claim) return;

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser) {
        toast({
          title: "Error",
          description: "You must be logged in to review claims",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Update claim
      const token = localStorage.getItem("token");

      const updatedClaim = {
        ...claim,
        status: data.status,
        approvedAmount:
          data.status === "approved"
            ? data.approvedAmount || claim.amount
            : undefined,
        comments: data.comments,
        reviewedBy: currentUser.id,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/claims/${claimId}`,
        updatedClaim,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const newClaim = response.data;

      setClaim(newClaim);

      toast({
        title: `Claim ${data.status}`,
        description: `Claim has been ${data.status} successfully.`,
      });
      navigate("/insurer/dashboard");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigate("/insurer/dashboard");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, "PPP");
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <p>Loading claim details...</p>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="container py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>

        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Claim not found</p>
            <Button variant="outline" className="mt-4" onClick={goBack}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" className="mb-6 gap-2" onClick={goBack}>
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claim Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <CardTitle>Claim Details</CardTitle>
                  <CardDescription>Review claim information</CardDescription>
                </div>
                <StatusBadge status={claim.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Patient Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{claim.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{claim.patientEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Claim Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Submitted on {formatDate(claim.submissionDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Status: {claim.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Amount: {formatCurrency(claim.amount)}</span>
                      </div>
                      {claim.status === "approved" && claim.approvedAmount && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-status-approved" />
                          <span>
                            Approved: {formatCurrency(claim.approvedAmount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Description
                  </h3>
                  <p className="bg-secondary/50 p-3 rounded-md text-sm">
                    {claim.description}
                  </p>

                  {claim.comments && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Review Comments
                      </h3>
                      <p className="bg-secondary/50 p-3 rounded-md text-sm">
                        {claim.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Supporting Documents
                </h3>

                {claim?.documents && claim.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {claim.documents.map((doc, id) => (
                      <a
                        key={id}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border rounded-lg overflow-hidden hover:border-primary transition-colors group"
                      >
                        <div className="aspect-video bg-secondary/50 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{`Document ${
                            id + 1
                          }`}</p>
                          {/* <p className="text-xs text-muted-foreground mt-1">{formatDate(doc.uploadDate)}</p> */}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No documents attached
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Form */}
        <Card className="lg:sticky lg:top-20 self-start">
          <CardHeader>
            <CardTitle>Review Decision</CardTitle>
            <CardDescription>
              Process this claim by approving or rejecting it
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Decision</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="approved" id="approved" />
                            <label
                              htmlFor="approved"
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="h-4 w-4 text-status-approved" />
                              <span>Approve</span>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rejected" id="rejected" />
                            <label
                              htmlFor="rejected"
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="h-4 w-4 text-status-rejected" />
                              <span>Reject</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("status") === "approved" && (
                  <FormField
                    control={form.control}
                    name="approvedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : parseFloat(e.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Enter the amount to be approved for this claim
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="comments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add your review comments..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide comments about your decision
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {setIsLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default ReviewClaim;
