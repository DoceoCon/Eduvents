import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Star } from 'lucide-react';
import { Event, categories, formats, SubjectArea, EventPhase } from '@/data/events';
import SubjectTagInput from '@/components/SubjectTagInput';
import PhaseTagInput from '@/components/PhaseTagInput';
import { toast } from 'sonner';

interface EventEditDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const EventEditDialog = ({ event, isOpen, onClose, onSave }: EventEditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      // eslint-disable-next-line
      setFormData({
        ...event,
      });
    }
  }, [event]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subjects: SubjectArea[]) => {
    setFormData(prev => ({ ...prev, subjectAreas: subjects }));
  };

  const handlePhaseChange = (phases: EventPhase[]) => {
    setFormData(prev => ({ ...prev, phases }));
  };

  const handleSave = async () => {
    if (!event) return;

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedEvent: Event = {
      ...event,
      ...formData,
      lastUpdated: new Date().toISOString().split('T')[0]
    } as Event;

    onSave(updatedEvent);
    setIsSaving(false);
    onClose();
    toast.success('Event updated successfully!');
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
              onCheckedChange={(checked) => handleChange('featured', checked)}
              className="data-[state=checked]:bg-yellow-500"
            />
            <div className="flex items-center gap-2">
              <Star className={`h-5 w-5 ${formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
              <span className="font-medium">Featured Event</span>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription || ''}
                onChange={(e) => handleChange('fullDescription', e.target.value)}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Event Format *</Label>
                <Select value={formData.format} onValueChange={(v) => handleChange('format', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {formats.map((format) => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                value={formData.date || ''}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime || ''}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime || ''}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          {/* Cost */}
          <div className="space-y-4">
            <Label>Cost to Attend</Label>
            <RadioGroup
              value={formData.isFree ? 'free' : 'paid'}
              onValueChange={(v) => handleChange('isFree', v === 'free')}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="edit-free" />
                <Label htmlFor="edit-free" className="cursor-pointer">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="edit-paid" />
                <Label htmlFor="edit-paid" className="cursor-pointer">Paid</Label>
              </div>
            </RadioGroup>

            {!formData.isFree && (
              <div>
                <Label htmlFor="price">Ticket Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    className="pl-7"
                  />
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
                value={formData.organiser || ''}
                onChange={(e) => handleChange('organiser', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="organiserEmail">Contact Email *</Label>
              <Input
                id="organiserEmail"
                type="email"
                value={formData.organiserEmail || ''}
                onChange={(e) => handleChange('organiserEmail', e.target.value)}
              />
            </div>
          </div>

          {/* Booking Link */}
          <div>
            <Label htmlFor="bookingUrl">External Booking Link</Label>
            <Input
              id="bookingUrl"
              type="url"
              value={formData.bookingUrl || ''}
              onChange={(e) => handleChange('bookingUrl', e.target.value)}
            />
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              type="url"
              value={formData.image || ''}
              onChange={(e) => handleChange('image', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventEditDialog;
