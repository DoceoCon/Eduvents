import mongoose, { Schema, model, models } from 'mongoose';

export interface IEvent {
    title: string;
    description: string;
    fullDescription?: string;
    category: string;
    format: string;
    subjectAreas: string[];
    phases: string[];
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    organiser: string;
    organiserEmail: string;
    image: string;
    bookingUrl: string;
    featured: boolean;
    status: 'pending' | 'approved' | 'rejected';
    submissionDate: string;
    isFree: boolean;
    price?: number;
    isAdminCreated?: boolean;
    paymentStatus?: 'unpaid' | 'paid';
    stripeSessionId?: string;
}

const EventSchema = new Schema<IEvent>({
    title: {
        type: String,
        required: [true, 'Required'],
        maxlength: [50, 'Title must be 50 characters or less']
    },
    description: {
        type: String,
        required: [true, 'Required'],
        maxlength: [1000, 'Description must be 1000 characters or less']
    },
    fullDescription: {
        type: String,
        required: false
    },
    category: { type: String, required: [true, 'Required'] },
    format: { type: String, required: [true, 'Required'] },
    subjectAreas: [{ type: String }],
    phases: [{ type: String }],
    date: { type: String, required: [true, 'Required'] },
    startTime: { type: String, required: [true, 'Required'] },
    endTime: { type: String, required: [true, 'Required'] },
    location: { type: String, required: [true, 'Required'] },
    organiser: {
        type: String,
        required: [true, 'Required'],
        maxlength: [50, 'Name must be 50 characters or less']
    },
    organiserEmail: {
        type: String,
        required: [true, 'Required'],
        match: [/@/, 'Incorrect email format. Email must contain @']
    },
    image: { type: String, required: [true, 'Required'] },
    bookingUrl: {
        type: String,
        required: [true, 'Required']
    },
    featured: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submissionDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    isFree: { type: Boolean, default: true },
    price: { type: Number },
    isAdminCreated: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    stripeSessionId: { type: String }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret: any) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;
