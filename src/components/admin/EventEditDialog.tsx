import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import {
  Event,
  categories,
  formats,
  SubjectArea,
  EventPhase,
} from "@/data/events";
import SubjectTagInput from "@/components/SubjectTagInput";
import PhaseTagInput from "@/components/PhaseTagInput";
import TimeInput from "@/components/TimeInput";
import { toast } from "sonner";

interface EventEditDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const EventEditDialog = ({
  event,
  isOpen,
  onClose,
  onSave,
}: EventEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen && event?.id) {
      // Fetch fresh event data when dialog opens
      fetch(`/api/admin/events/${event.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setFormData({ ...data.event });
            setImagePreview(data.event.image);
            setSelectedFile(null);
            setErrors({});
          }
        })
        .catch((error) => {
          console.error("Error fetching event:", error);
        });
    }
  }, [isOpen, event?.id]);

  const getCharCount = (text: string) => text.replace(/\s+/g, "").length;

  const handleChange = (field: string, value: string | boolean | number) => {
    // Block description input if character count (excluding spaces/newlines) reaches 2000
    if (field === "description" && typeof value === "string") {
      const newCharCount = getCharCount(value);
      const prevCharCount = getCharCount(formData.description || "");
      if (newCharCount > 2000 && newCharCount > prevCharCount) {
        return;
      }
    }

    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === "startDate" && typeof value === "string") {
        newData.endDate = value;
      }
      return newData;
    });

    // Live validation for character limits
    if (field === "title" && typeof value === "string" && value.length > 100) {
      setErrors((prev) => ({
        ...prev,
        title: "Title must be 100 characters or less",
      }));
    } else if (
      field === "organiser" &&
      typeof value === "string" &&
      value.length > 50
    ) {
      setErrors((prev) => ({
        ...prev,
        organiser: "Name must be 50 characters or less",
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

  const handleFeaturedToggle = async (checked: boolean) => {
    if (!event) return;

    // Update local state first
    handleChange("featured", checked);

    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: checked }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(
          checked ? "Event marked as featured" : "Event removed from featured",
        );
        // Notify parent to update the list, but our useEffect now prevents form wipe
        onSave(result.event);
      } else {
        toast.error("Failed to update featured status");
        handleChange("featured", !checked);
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
      handleChange("featured", !checked);
    }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Required";
    else if (formData.title.length > 100)
      newErrors.title = "Title must be 100 characters or less";

    if (!formData.description?.trim()) newErrors.description = "Required";
    else if (getCharCount(formData.description) > 2000) {
      newErrors.description = "Description must be 2000 characters or less (excluding spaces)";
    }

    if (!formData.organiser?.trim()) newErrors.organiser = "Required";
    else if (formData.organiser.length > 50)
      newErrors.organiser = "Name must be 50 characters or less";

    if (formData.organiserEmail && !formData.organiserEmail.includes("@")) {
      newErrors.organiserEmail = "Incorrect email format. Email must contain @";
    }

    if (formData.bookingUrl) {
      try {
        new URL(formData.bookingUrl);
      } catch {
        newErrors.bookingUrl = "Incorrect URL. Please enter a valid URL.";
      }
    }

    if (!formData.isFree) {
      if (formData.priceTo !== undefined && formData.priceTo !== null && formData.priceTo !== "" && (formData.priceTo as number) <= 0) {
        newErrors.priceTo = "Price To must be greater than 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!event) return;
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "subjectAreas" || key === "phases") {
          data.append(key, JSON.stringify(value));
        } else if (key !== "image") {
          // Trim text fields to avoid extra whitespace
          const stringValue = String(value);
          const trimmedValue = (key === "title" || key === "description" || key === "organiser" || key === "location")
            ? stringValue.trim()
            : stringValue;
          data.append(key, trimmedValue);
        }
      });

      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "PUT",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        onSave(result.event);
        onClose();
        toast.success("Event updated successfully!");
      } else {
        toast.error(result.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsSaving(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Featured Toggle */}
          <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
            <Switch
              checked={formData.featured || false}
              onCheckedChange={handleFeaturedToggle}
              className="data-[state=checked]:bg-yellow-400"
            />
            <div className="flex items-center gap-2">
              <Star
                className={`h-5 w-5 ${formData.featured ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
              />
              <span className="font-medium">Featured Event</span>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
                maxLength={100}
              />
              <p
                className={`text-sm mt-1 ${(formData.title?.length || 0) >= 100 ? "text-destructive font-medium" : "text-muted-foreground"}`}
              >
                {formData.title?.length || 0}/100 characters
              </p>
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className={errors.description ? "border-destructive" : ""}
              />
              <p
                className={`text-sm mt-1 ${getCharCount(formData.description || "") >= 2000 ? "text-destructive font-medium" : "text-muted-foreground"}`}
              >
                {getCharCount(formData.description || "")}/2000 characters
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
                  <p className="text-sm text-destructive mt-1">
                    {errors.format}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label>Subject Areas</Label>
              <SubjectTagInput
                selectedSubjects={formData.subjectAreas || []}
                onChange={handleSubjectChange}
              />
            </div>

            <div>
              <Label>Educational Phases</Label>
              <PhaseTagInput
                selectedPhases={formData.phases || []}
                onChange={handlePhaseChange}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
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
                value={formData.endDate || ""}
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

            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <TimeInput
                value={formData.startTime || ""}
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
                value={formData.endTime || ""}
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

          {/* Location */}
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className={errors.location ? "border-destructive" : ""}
            />
            {errors.location && (
              <p className="text-sm text-destructive mt-1">{errors.location}</p>
            )}
          </div>

          {/* Cost */}
          <div className="space-y-4">
            <Label>Cost to Attend</Label>
            <RadioGroup
              value={formData.isFree ? "free" : "paid"}
              onValueChange={(v) => handleChange("isFree", v === "free")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="edit-free" />
                <Label htmlFor="edit-free" className="cursor-pointer">
                  Free
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="edit-paid" />
                <Label htmlFor="edit-paid" className="cursor-pointer">
                  Paid
                </Label>
              </div>
            </RadioGroup>

            {!formData.isFree && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceFrom">Price From *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      £
                    </span>
                    <Input
                      id="priceFrom"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.priceFrom ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange("priceFrom", val === "" ? "" : parseFloat(val));
                      }}
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
                  <Label htmlFor="priceTo">Price To (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      £
                    </span>
                    <Input
                      id="priceTo"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.priceTo ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleChange("priceTo", val === "" ? "" : parseFloat(val));
                      }}
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
            )}
          </div>

          {/* Organiser Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organiser">Organisation Name *</Label>
              <Input
                id="organiser"
                value={formData.organiser || ""}
                onChange={(e) => handleChange("organiser", e.target.value)}
                className={errors.organiser ? "border-destructive" : ""}
                maxLength={50}
              />
              <p
                className={`text-sm mt-1 ${(formData.organiser?.length || 0) >= 50 ? "text-destructive font-medium" : "text-muted-foreground"}`}
              >
                {formData.organiser?.length || 0}/50 characters
              </p>
              {errors.organiser && (
                <p className="text-sm text-destructive mt-1">
                  {errors.organiser}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="organiserEmail">Contact Email *</Label>
              <Input
                id="organiserEmail"
                type="email"
                value={formData.organiserEmail || ""}
                onChange={(e) => handleChange("organiserEmail", e.target.value)}
                className={errors.organiserEmail ? "border-destructive" : ""}
              />
              {errors.organiserEmail && (
                <p className="text-sm text-destructive mt-1">
                  {errors.organiserEmail}
                </p>
              )}
            </div>
          </div>

          {/* Booking Link */}
          <div>
            <Label htmlFor="bookingUrl">External Booking Link *</Label>
            <Input
              id="bookingUrl"
              type="url"
              value={formData.bookingUrl || ""}
              onChange={(e) => handleChange("bookingUrl", e.target.value)}
              className={errors.bookingUrl ? "border-destructive" : ""}
            />
            {errors.bookingUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.bookingUrl}
              </p>
            )}
          </div>

          {/* Event Image */}
          <div>
            <Label>Event Image *</Label>
            {imagePreview ? (
              <div className="mt-2 border-2 border-border rounded-lg p-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
                <div className="flex gap-2 justify-center mt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    Remove Image
                  </Button>
                  <label htmlFor="change-image">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("change-image")?.click()}
                    >
                      Change Image
                    </Button>
                  </label>
                  <Input
                    id="change-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div
                className={`mt-2 border-2 border-dashed ${errors.image ? "border-destructive" : isDragging ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-8 text-center hover:border-primary transition-all duration-200 cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("upload-image")?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-foreground mb-1">
                      Click to upload new image
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop your image here
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG or JPG (max 25MB)
                    </p>
                  </div>
                </div>
                <Input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
            {errors.image && (
              <p className="text-sm text-destructive mt-2">{errors.image}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isSaving || Object.keys(errors).some((key) => errors[key])
              }
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
