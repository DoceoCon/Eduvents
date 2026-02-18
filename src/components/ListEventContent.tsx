"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, CreditCard, Check, Info, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { categories, formats, SubjectArea, EventPhase } from "@/data/events";
import SubjectTagInput from "@/components/SubjectTagInput";
import PhaseTagInput from "@/components/PhaseTagInput";
import TimeInput from "@/components/TimeInput";
import { toast } from "sonner";

interface ListEventContentProps {
  isAdminMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ListEventContent = ({
  isAdminMode = false,
  onSuccess,
  onCancel,
}: ListEventContentProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    format: "",
    subjectAreas: [] as SubjectArea[],
    phases: [] as EventPhase[],
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    isFree: "free",
    priceFrom: "",
    priceTo: "",
    organiserName: "",
    organiserEmail: "",
    bookingUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    const requiredFields = [
      "title",
      "description",
      "category",
      "format",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "location",
      "organiserName",
      "organiserEmail",
      "bookingUrl",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        newErrors[field] = "Required";
      }
    });

    if (!selectedFile && !imagePreview) newErrors.image = "Required";

    // Specific constraints
    if (formData.title && formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }
    if (
      formData.description &&
      formData.description.replace(/\s+/g, "").length > 2000
    ) {
      newErrors.description =
        "Description must be 2000 characters or less (excluding spaces)";
    }
    if (formData.organiserName && formData.organiserName.length > 50) {
      newErrors.organiserName = "Name must be 50 characters or less";
    }
    if (formData.organiserEmail && !formData.organiserEmail.includes("@")) {
      newErrors.organiserEmail = "Incorrect email format. Email must contain @";
    }
    if (formData.bookingUrl) {
      try {
        new URL(formData.bookingUrl);
      } catch (e) {
        newErrors.bookingUrl = "Incorrect URL. Please enter a valid URL.";
      }
    }

    // Past date validation
    if (formData.startDate) {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.startDate = "Date cannot be in the past";
      }
    }

    // End date validation
    if (formData.endDate && formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (formData.isFree === "paid") {
      if (!formData.priceFrom) {
        newErrors.priceFrom = "Required";
      }
      if (formData.priceTo && parseFloat(formData.priceTo) <= 0) {
        newErrors.priceTo = "Price must be greater than 0";
      } else if (formData.priceFrom && formData.priceTo) {
        const from = parseFloat(formData.priceFrom);
        const to = parseFloat(formData.priceTo);
        if (to < from) {
          newErrors.priceTo =
            "Maximum price must be greater than or equal to minimum price";
        }
      }
    }

    if (selectedFile) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.image = "Incorrect File Format. File must be PNG or JPG.";
      }
      if (selectedFile.size > 25 * 1024 * 1024) {
        newErrors.image =
          "File size too big. File size should be less than 25mb";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCharCount = (text: string) => text.replace(/\s+/g, "").length;

  const handleChange = (field: string, value: string) => {
    // Enforce character limits for fields that have maxLength
    const charLimits: Record<string, number> = {
      title: 100,
      organiserName: 50,
    };
    if (charLimits[field] && value.length > charLimits[field]) {
      value = value.slice(0, charLimits[field]);
    }

    // Block description input if character count (excluding spaces/newlines) reaches 2000
    if (field === "description") {
      const newCharCount = getCharCount(value);
      const prevCharCount = getCharCount(formData.description);
      if (newCharCount > 2000 && newCharCount > prevCharCount) {
        return;
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "startDate") {
        newData.endDate = value;
      }
      return newData;
    });

    // Clear endDate error when auto-filling from startDate
    if (field === "startDate" && value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.endDate;
        return newErrors;
      });
    }

    // Clear price errors when switching to "free"
    if (field === "isFree" && value === "free") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.priceFrom;
        delete newErrors.priceTo;
        return newErrors;
      });
      return;
    }

    // Live validation for character limits
    if (field === "title" && value.length > 100) {
      setErrors((prev) => ({
        ...prev,
        title: "Title must be 100 characters or less",
      }));
    } else if (field === "description" && getCharCount(value) > 2000) {
      setErrors((prev) => ({
        ...prev,
        description:
          "Description must be 2000 characters or less (excluding spaces)",
      }));
    } else if (field === "organiserName" && value.length > 50) {
      setErrors((prev) => ({
        ...prev,
        organiserName: "Name must be 50 characters or less",
      }));
    } else if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubjectChange = (subjects: SubjectArea[]) => {
    setFormData((prev) => ({ ...prev, subjectAreas: subjects }));
  };

  const handlePhaseChange = (phases: EventPhase[]) => {
    setFormData((prev) => ({ ...prev, phases }));
  };

  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set target dimensions to 1200x675 (16:9 ratio)
          canvas.width = 1200;
          canvas.height = 675;

          if (ctx) {
            // Calculate scaling to cover the canvas while maintaining aspect ratio
            const scale = Math.max(
              canvas.width / img.width,
              canvas.height / img.height,
            );
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            // Center the image
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;

            // Draw image
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

            // Convert canvas to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(resizedFile);
                } else {
                  reject(new Error("Failed to resize image"));
                }
              },
              file.type,
              0.95,
            );
          } else {
            reject(new Error("Failed to get canvas context"));
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleImageFile = async (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Incorrect File Format. File must be PNG or JPG.",
      }));
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "File size too big. File size should be less than 25mb",
      }));
      return;
    }

    try {
      // Resize the image to 1200x675
      const resizedFile = await resizeImage(file);
      setSelectedFile(resizedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(resizedFile);
    } catch (error) {
      console.error("Error resizing image:", error);
      setErrors((prev) => ({
        ...prev,
        image: "Failed to process image. Please try another image.",
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const success = query.get("success");
    const canceled = query.get("canceled");
    const sessionId = query.get("session_id");
    const eventId = query.get("event_id");

    if (success === "true" && sessionId && eventId) {
      verifyPayment(sessionId, eventId);
    } else if (canceled === "true" && eventId) {
      handleCancellation(eventId);
    }
  }, []);

  const handleCancellation = async (eventId: string) => {
    try {
      await fetch("/api/checkout/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      toast.error("Payment canceled. Your event was not listed.");
      // Clean up URL
      router.replace("/list-event");
    } catch (error) {
      console.error("Error cleaning up canceled event:", error);
    }
  };

  const verifyPayment = async (sessionId: string, eventId: string) => {
    setVerifyingPayment(true);
    try {
      const response = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, eventId }),
      });

      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        router.replace("/list-event");
      } else {
        toast.error(result.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Error verifying payment");
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("format", formData.format);
      data.append("subjectAreas", JSON.stringify(formData.subjectAreas));
      data.append("phases", JSON.stringify(formData.phases));
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("startTime", formData.startTime);
      data.append("endTime", formData.endTime);
      data.append("location", formData.location);
      data.append("isFree", (formData.isFree === "free").toString());
      data.append("priceFrom", formData.priceFrom);
      data.append("priceTo", formData.priceTo);
      data.append("organiser", formData.organiserName);
      data.append("organiserEmail", formData.organiserEmail);
      data.append("bookingUrl", formData.bookingUrl);
      data.append("isAdmin", isAdminMode.toString());
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const response = await fetch("/api/events", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        if (isAdminMode) {
          toast.success("Event Created Successfully.");
          if (onSuccess) {
            onSuccess();
          } else {
            setShowSuccess(true);
          }
        } else if (result.stripeUrl) {
          // User mode: Redirect to Stripe immediately
          window.location.href = result.stripeUrl;
        } else {
          // Fallback for non-paid user events if any
          setShowSuccess(true);
        }
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
        toast.error(result.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifyingPayment) {
    return (
      <Layout>
        <div className="container-tight py-20">
          <div className="max-w-lg mx-auto text-center bg-card rounded-lg p-12 shadow-card">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we confirm your transaction.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (showSuccess && !isAdminMode) {
    return (
      <Layout>
        <div className="container-tight py-20">
          <div className="max-w-lg mx-auto text-center bg-card rounded-lg p-12 shadow-card animate-slide-up">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-success-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Event Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for submitting your event. Our team will review it
              within 24 hours and notify you once it&apos;s approved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/events")}>
                Browse Events
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuccess(false);
                  setFormData({
                    title: "",
                    description: "",
                    category: "",
                    format: "",
                    subjectAreas: [],
                    phases: [],
                    startDate: "",
                    endDate: "",
                    startTime: "",
                    endTime: "",
                    location: "",
                    isFree: "free",
                    priceFrom: "",
                    priceTo: "",
                    organiserName: "",
                    organiserEmail: "",
                    bookingUrl: "",
                  });
                  setImagePreview(null);
                }}
              >
                Submit Another
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Event Details */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Event Details</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., STEM Innovation Conference 2026"
              className={errors.title ? "border-destructive" : ""}
              maxLength={100}
            />
            <p
              className={`text-sm mt-1 ${formData.title.length >= 100 ? "text-destructive font-medium" : "text-muted-foreground"}`}
            >
              {formData.title.length}/100 characters
            </p>
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your event in detail..."
              rows={5}
              className={errors.description ? "border-destructive" : ""}
            />
            <p
              className={`text-sm mt-1 ${getCharCount(formData.description) >= 2000 ? "text-destructive font-medium" : "text-muted-foreground"}`}
            >
              {getCharCount(formData.description)}/2000 characters
            </p>
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => handleChange("category", v)}
              >
                <SelectTrigger
                  className={errors.category ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <Label>Event Format *</Label>
              <Select
                value={formData.format}
                onValueChange={(v) => handleChange("format", v)}
              >
                <SelectTrigger
                  className={errors.format ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.format && (
                <p className="text-sm text-destructive mt-1">{errors.format}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Subject Areas (Optional)</Label>
            <SubjectTagInput
              selectedSubjects={formData.subjectAreas}
              onChange={handleSubjectChange}
            />
          </div>

          <div>
            <Label>Educational Phases (Optional)</Label>
            <PhaseTagInput
              selectedPhases={formData.phases}
              onChange={handlePhaseChange}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Select the education levels this event is relevant to
            </p>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Date & Time</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => handleChange("startDate", e.target.value)}
                onKeyDown={(e) => e.preventDefault()}
                className={errors.startDate ? "border-destructive" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive mt-1">
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                min={
                  formData.startDate || new Date().toISOString().split("T")[0]
                }
                onChange={(e) => handleChange("endDate", e.target.value)}
                onKeyDown={(e) => e.preventDefault()}
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive mt-1">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <TimeInput
                value={formData.startTime}
                onChange={(value) => handleChange("startTime", value)}
                className={errors.startTime ? "border-destructive" : ""}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive mt-1">
                  {errors.startTime}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <TimeInput
                value={formData.endTime}
                onChange={(value) => handleChange("endTime", value)}
                className={errors.endTime ? "border-destructive" : ""}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive mt-1">
                  {errors.endTime}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Location</h2>

        <div>
          <Label htmlFor="location">Venue or Platform *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Enter venue address or online platform"
            className={errors.location ? "border-destructive" : ""}
          />
          {errors.location && (
            <p className="text-sm text-destructive mt-1">{errors.location}</p>
          )}
        </div>
      </div>

      {/* Cost to Attend */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Cost to Attend</h2>

        <div className="space-y-4">
          <RadioGroup
            value={formData.isFree}
            onValueChange={(v) => handleChange("isFree", v)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free" />
              <Label htmlFor="free" className="cursor-pointer">
                Free
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid" />
              <Label htmlFor="paid" className="cursor-pointer">
                Paid
              </Label>
            </div>
          </RadioGroup>

          {formData.isFree === "paid" && (
            <div className="animate-fade-in">
              <Label>Ticket Price Range</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="priceFrom"
                    className="text-sm text-muted-foreground"
                  >
                    From *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      £
                    </span>
                    <Input
                      id="priceFrom"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.priceFrom}
                      onChange={(e) =>
                        handleChange("priceFrom", e.target.value)
                      }
                      placeholder="50"
                      className={`pl-7 ${errors.priceFrom ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.priceFrom && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.priceFrom}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="priceTo"
                    className="text-sm text-muted-foreground"
                  >
                    To (Optional)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      £
                    </span>
                    <Input
                      id="priceTo"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.priceTo}
                      onChange={(e) => handleChange("priceTo", e.target.value)}
                      placeholder="150"
                      className={`pl-7 ${errors.priceTo ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.priceTo && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.priceTo}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Enter the price range for tickets (e.g., £50 - £150)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Organiser Information */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Organiser Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organiserName">Organisation Name *</Label>
            <Input
              id="organiserName"
              value={formData.organiserName}
              onChange={(e) => handleChange("organiserName", e.target.value)}
              placeholder="Your organisation"
              className={errors.organiserName ? "border-destructive" : ""}
              maxLength={50}
            />
            <p
              className={`text-sm mt-1 ${formData.organiserName.length >= 50 ? "text-destructive font-medium" : "text-muted-foreground"}`}
            >
              {formData.organiserName.length}/50 characters
            </p>
            {errors.organiserName && (
              <p className="text-sm text-destructive mt-1">
                {errors.organiserName}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="organiserEmail">Contact Email *</Label>
            <Input
              id="organiserEmail"
              type="email"
              value={formData.organiserEmail}
              onChange={(e) => handleChange("organiserEmail", e.target.value)}
              placeholder="email@example.com"
              className={errors.organiserEmail ? "border-destructive" : ""}
            />
            {errors.organiserEmail && (
              <p className="text-sm text-destructive mt-1">
                {errors.organiserEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Event Image */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Event Image *</h2>

        <div
          className={`border-2 border-dashed ${errors.image ? "border-destructive" : isDragging ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-8 text-center hover:border-primary transition-all duration-200`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Drag and drop your image here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Upload any image (JPG or PNG)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {errors.image && (
          <p className="text-sm text-destructive mt-2">{errors.image}</p>
        )}
      </div>

      {/* Booking Link */}
      <div className="bg-card rounded-lg p-3 shadow-card">
        <h2 className="text-xl font-semibold mb-6">Booking</h2>

        <div>
          <Label htmlFor="bookingUrl">External Booking Link *</Label>
          <Input
            id="bookingUrl"
            type="url"
            value={formData.bookingUrl}
            onChange={(e) => handleChange("bookingUrl", e.target.value)}
            placeholder="https://your-booking-page.com"
            className={errors.bookingUrl ? "border-destructive" : ""}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Link where attendees can register
          </p>
          {errors.bookingUrl && (
            <p className="text-sm text-destructive mt-1">{errors.bookingUrl}</p>
          )}
        </div>
      </div>
    </form>
  );

  // Admin mode - no layout wrapper, no payment
  if (isAdminMode) {
    return (
      <div className="space-y-6">
        {formContent}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={
              isSubmitting || Object.keys(errors).some((key) => errors[key])
            }
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-hero py-12">
        <div className="container-tight">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            List Your Event
          </h1>
          <p className="text-primary-foreground/80">
            Share your educational event with thousands of educators
          </p>
        </div>
      </div>

      <div className="container-tight py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">{formContent}</div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-3 shadow-card sticky top-24">
              <div className="bg-accent rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-accent-foreground">
                      Listing Fee
                    </p>
                    <p className="text-3xl font-bold text-primary my-2">
                      £99{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (Exclusive of VAT)
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      One-time payment per listing
                    </p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-lg"
                onClick={handleSubmit}
                disabled={
                  isSubmitting || Object.keys(errors).some((key) => errors[key])
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay with Stripe
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                Your event will be reviewed within 24 hours
              </p>

              <div className="border-t border-border mt-6 pt-6">
                <h3 className="font-semibold mb-3">What&apos;s included:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                    Listing live until event closes
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                    Reach thousands of educators
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                    Featured on category pages
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-success mr-2 mt-0.5" />
                    Social sharing tools
                  </li>
                </ul>
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-lg p-5 mt-6 text-center">
                <p className="text-sm font-medium text-foreground mb-3">
                  Are you running multiple events? Contact our team for a custom
                  quote.
                </p>
                <Link href="mailto:info@doceoconsulting.co.uk">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListEventContent;
