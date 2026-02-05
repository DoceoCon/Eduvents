import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeInputProps {
  value: string; // 24-hour format "HH:mm"
  onChange: (value: string) => void;
  className?: string;
}

const TimeInput = ({ value, onChange, className }: TimeInputProps) => {
  // Parse the 24-hour time value
  const parseTime = (time24: string) => {
    if (!time24) return { hour: '', minute: '', period: 'AM' };

    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'PM' : 'AM';

    return {
      hour: hour12.toString(),
      minute: minutes || '00',
      period
    };
  };

  // Convert 12-hour time to 24-hour format
  const to24Hour = (hour: string, minute: string, period: string) => {
    if (!hour) return '';

    // Use '00' as default minute if not provided
    const finalMinute = minute || '00';

    let hour24 = parseInt(hour, 10);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${finalMinute}`;
  };

  const { hour, minute, period } = parseTime(value);

  const handleChange = (field: 'hour' | 'minute' | 'period', newValue: string) => {
    const updatedHour = field === 'hour' ? newValue : (hour || '12');
    const updatedMinute = field === 'minute' ? newValue : (minute || '00');
    const updatedPeriod = field === 'period' ? newValue : period;

    const time24 = to24Hour(updatedHour, updatedMinute, updatedPeriod);
    if (time24) {
      onChange(time24);
    }
  };

  // Generate hours (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <Select value={hour} onValueChange={(v) => handleChange('hour', v)}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent className="bg-card max-h-60">
          {hours.map((h) => (
            <SelectItem key={h} value={h}>{h}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="flex items-center text-muted-foreground">:</span>

      <Select value={minute} onValueChange={(v) => handleChange('minute', v)}>
        <SelectTrigger className="w-20">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="bg-card max-h-60">
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={(v) => handleChange('period', v)}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-card">
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeInput;
