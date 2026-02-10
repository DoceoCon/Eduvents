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
    if (event) {
      setFormData({
        ...event,
      });
      setImagePreview(event.image);
    }
  }, [event?.id]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Live validation for character limits
    if (field === "title" && typeof value === "string" && value.length > 100) {
      setErrors((prev) => ({
        ...prev,
        title: "Title must be 100 characters or less",
      }));
    } else if (
      field === "description" &&
      typeof value === "string" &&
      value.length > 2000
    ) {
      setErrors((prev) => ({
        ...prev,
        description: "Description must be 2000 characters or less",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleImageFile = (file: File) => {
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

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
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
    else if (formData.description.length > 2000)
      newErrors.description = "Description must be 2000 characters or less";

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
          data.append(key, String(value));
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
                maxLength={2000}
              />
              <p
                className={`text-sm mt-1 ${(formData.description?.length || 0) >= 2000 ? "text-destructive font-medium" : "text-muted-foreground"}`}
              >
                {formData.description?.length || 0}/2000 characters
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
              <Label htmlFor="date">Event Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => handleChange("date", e.target.value)}
                onKeyDown={(e) => e.preventDefault()}
                className={errors.date ? "border-destructive" : ""}
              />
              {errors.date && (
                <p className="text-sm text-destructive mt-1">{errors.date}</p>
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
              <div>
                <Label htmlFor="price">Ticket Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) =>
                      handleChange("price", parseFloat(e.target.value) || 0)
                    }
                    className={`pl-7 ${errors.price ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.price}
                  </p>
                )}
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
            <Label htmlFor="bookingUrl">External Booking Link</Label>
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
            <Label>Event Image</Label>
            <div
              className={`mt-2 border-2 border-dashed ${errors.image ? "border-destructive" : isDragging ? "border-primary bg-primary/5" : "border-border"} rounded-lg p-3 text-center hover:border-primary transition-all duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded-lg"
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
                    Change Image
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <span className="text-muted-foreground mb-2">
                      Click to upload new image
                    </span>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || Object.keys(errors).some(key => errors[key])}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
