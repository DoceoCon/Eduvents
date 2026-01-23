export type EventCategory =
  | 'Webinar'
  | 'Podcast'
  | 'Conference'
  | 'CPD Training'
  | 'Awards Show'
  | 'Festival'
  | 'Exhibition';

export type EventFormat = 'In-Person' | 'Virtual' | 'Hybrid';

export type SubjectArea =
  | 'English'
  | 'Maths'
  | 'Science'
  | 'STEM'
  | 'Leadership'
  | 'Technology'
  | 'Inclusion'
  | 'Assessment'
  | 'Wellbeing'
  | 'Humanities'
  | 'Geography';

export type EventPhase =
  | 'Primary'
  | 'Secondary'
  | 'Further Education'
  | 'Higher Education'
  | 'Special Schools'
  | 'Nursery'
  | 'Independent';

export interface Event {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: EventCategory;
  format: EventFormat;
  subjectAreas: SubjectArea[];
  phases: EventPhase[];
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
  lastUpdated?: string;
}

export const events: Event[] = [
  {
    id: '1',
    title: 'STEM Innovation Conference 2026',
    description: 'Explore the latest in STEM education with hands-on workshops and keynote speakers from leading tech companies.',
    fullDescription: `Join us for the UK's premier STEM education conference, bringing together educators, innovators, and industry leaders to explore cutting-edge approaches to science, technology, engineering, and mathematics education.

This two-day event features hands-on workshops, inspiring keynotes from leading tech companies, and networking opportunities with fellow educators passionate about preparing students for the future.

Highlights include sessions on AI in education, sustainable technology projects, and coding curriculum development. Don't miss the exhibition hall showcasing the latest EdTech tools and resources.`,
    category: 'Conference',
    format: 'In-Person',
    subjectAreas: ['STEM', 'Technology', 'Science'],
    phases: ['Secondary', 'Further Education'],
    date: '2026-02-15',
    startTime: '09:00',
    endTime: '17:00',
    location: 'ExCeL London',
    organiser: 'STEM Learning UK',
    organiserEmail: 'events@stemlearning.org.uk',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: true,
    status: 'approved',
    submissionDate: '2026-01-05',
    isFree: false,
    price: 120
  },
  {
    id: '2',
    title: 'Wellbeing Workshop for Teachers',
    description: 'A full-day workshop focused on teacher mental health, stress management, and building resilience.',
    fullDescription: `Teacher wellbeing is essential for creating positive learning environments. This workshop provides practical strategies for managing stress, preventing burnout, and building resilience in the demanding profession of education.

Led by clinical psychologists and experienced educators, you'll learn evidence-based techniques for mindfulness, work-life balance, and creating supportive school cultures.

Take home actionable plans for self-care and strategies to implement wellbeing practices in your school community.`,
    category: 'CPD Training',
    format: 'In-Person',
    subjectAreas: ['Wellbeing'],
    phases: ['Primary', 'Secondary'],
    date: '2026-01-28',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Manchester Conference Centre',
    organiser: 'Education Support',
    organiserEmail: 'workshops@educationsupport.org.uk',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: true,
    status: 'approved',
    submissionDate: '2026-01-03',
    isFree: false,
    price: 75
  },
  {
    id: '3',
    title: 'EdTech Leadership Summit',
    description: 'For school leaders navigating digital transformation and implementing technology strategies.',
    fullDescription: `The EdTech Leadership Summit brings together headteachers, IT directors, and digital learning leads to share best practices in educational technology implementation.

Discover how leading schools are successfully integrating technology to enhance teaching and learning, manage digital safeguarding, and prepare students for a digital future.

Sessions cover topics including AI policy development, device management strategies, and measuring EdTech ROI.`,
    category: 'Conference',
    format: 'Hybrid',
    subjectAreas: ['Technology', 'Leadership'],
    phases: ['Secondary', 'Independent'],
    date: '2026-03-10',
    startTime: '09:30',
    endTime: '16:30',
    location: 'Birmingham NEC',
    organiser: 'Digital Education Council',
    organiserEmail: 'summit@digitaleducation.org.uk',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: true,
    status: 'approved',
    submissionDate: '2026-01-02',
    isFree: false,
    price: 150
  },
  {
    id: '4',
    title: 'Inclusive Education Webinar Series',
    description: 'Monthly webinars on supporting SEND students and creating inclusive classroom environments.',
    fullDescription: `Join our monthly webinar series dedicated to inclusive education practices. Each session focuses on different aspects of supporting students with special educational needs and disabilities.

This month's topic: Universal Design for Learning - creating lessons that work for all students.

Expert speakers share practical strategies, resources, and case studies from schools excelling in inclusion.`,
    category: 'Webinar',
    format: 'Virtual',
    subjectAreas: ['Inclusion', 'Wellbeing'],
    phases: ['Primary', 'Secondary', 'Special Schools'],
    date: '2026-01-22',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Online via Zoom',
    organiser: 'Nasen',
    organiserEmail: 'webinars@nasen.org.uk',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-04',
    isFree: true
  },
  {
    id: '5',
    title: 'Mathematics Mastery Workshop',
    description: 'Deep dive into mastery approaches for primary and secondary maths teaching.',
    fullDescription: `Transform your mathematics teaching with this intensive workshop on mastery approaches. Learn how to implement bar modelling, variation theory, and intelligent practice in your classroom.

Suitable for primary and secondary teachers, this workshop provides practical resources and lesson ideas you can use immediately.

Explore how leading maths departments are raising attainment through mastery techniques.`,
    category: 'CPD Training',
    format: 'In-Person',
    subjectAreas: ['Maths'],
    phases: ['Primary', 'Secondary'],
    date: '2026-02-08',
    startTime: '09:00',
    endTime: '15:30',
    location: 'Leeds Teaching School Hub',
    organiser: 'Maths Hub Yorkshire',
    organiserEmail: 'cpd@mathshubyorks.org.uk',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-06',
    isFree: false,
    price: 45
  },
  {
    id: '6',
    title: 'Education Podcast Live: The Teacher Toolkit Show',
    description: 'Live recording of the popular education podcast with audience Q&A.',
    fullDescription: `Experience The Teacher Toolkit Show live! Join host Ross McGill and special guests for a live recording of one of education's most popular podcasts.

This special event includes audience Q&A, networking drinks, and the chance to meet fellow educators from across the UK.

Topic: "The Future of Assessment" - exploring alternatives to traditional exams and how schools are innovating in student evaluation.`,
    category: 'Podcast',
    format: 'In-Person',
    subjectAreas: ['Assessment', 'Leadership'],
    phases: ['Secondary', 'Further Education'],
    date: '2026-02-20',
    startTime: '18:30',
    endTime: '21:00',
    location: 'The Roundhouse, London',
    organiser: 'Teacher Toolkit Media',
    organiserEmail: 'events@teachertoolkit.co.uk',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: true,
    status: 'approved',
    submissionDate: '2026-01-07',
    isFree: false,
    price: 25
  },
  {
    id: '7',
    title: 'National Teaching Awards 2026',
    description: 'Celebrating outstanding teachers and school leaders across the United Kingdom.',
    fullDescription: `The National Teaching Awards celebrate the life-changing impact made by teachers and teaching assistants, headteachers and lecturers.

Join us for an inspiring evening recognizing the dedication and excellence of educators across the UK. Winners in categories including Teacher of the Year, Headteacher of the Year, and Lifetime Achievement will be announced.

A truly uplifting celebration of the teaching profession.`,
    category: 'Awards Show',
    format: 'In-Person',
    subjectAreas: ['Leadership'],
    phases: ['Primary', 'Secondary', 'Further Education'],
    date: '2026-03-28',
    startTime: '18:00',
    endTime: '22:00',
    location: 'Royal Albert Hall, London',
    organiser: 'The Teaching Awards Trust',
    organiserEmail: 'awards@teachingawards.com',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-08',
    isFree: false,
    price: 85
  },
  {
    id: '8',
    title: 'Primary Science Festival',
    description: 'A fun-filled day of science activities and experiments for primary school pupils and teachers.',
    fullDescription: `Ignite curiosity and inspire the next generation of scientists at the Primary Science Festival! This hands-on event features interactive experiments, science shows, and workshops designed specifically for primary-aged children.

Teachers can explore new resources, connect with science outreach organisations, and discover ways to make science teaching more engaging.

Perfect for school trips or individual families passionate about science education.`,
    category: 'Festival',
    format: 'In-Person',
    subjectAreas: ['Science', 'STEM'],
    phases: ['Primary', 'Nursery'],
    date: '2026-03-15',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Glasgow Science Centre',
    organiser: 'Primary Science Teaching Trust',
    organiserEmail: 'festival@pstt.org.uk',
    image: 'https://images.unsplash.com/photo-1567168544646-208fa5d408fb?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-09',
    isFree: true
  },
  {
    id: '9',
    title: 'English Literature CPD: Modern Texts',
    description: 'Exploring contemporary literature for the secondary English curriculum.',
    fullDescription: `Refresh your English curriculum with contemporary voices and modern texts. This CPD day explores how to integrate diverse, contemporary literature into your teaching.

Sessions include author talks, lesson planning workshops, and discussions on selecting texts that resonate with today's students.

Leave with a curated reading list and ready-to-use lesson resources.`,
    category: 'CPD Training',
    format: 'Hybrid',
    subjectAreas: ['English', 'Humanities'],
    phases: ['Secondary'],
    date: '2026-02-05',
    startTime: '09:30',
    endTime: '15:00',
    location: 'Bristol University / Online',
    organiser: 'English & Media Centre',
    organiserEmail: 'cpd@englishandmedia.co.uk',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-10',
    isFree: false,
    price: 55
  },
  {
    id: '10',
    title: 'Geography Fieldwork Exhibition',
    description: 'Discover the latest fieldwork equipment, destinations, and techniques for geography teaching.',
    fullDescription: `The Geography Fieldwork Exhibition brings together providers, equipment suppliers, and curriculum experts to help you plan outstanding fieldwork experiences.

Explore destinations from local urban studies to international expeditions, discover new technologies for data collection, and learn about risk assessment best practices.

Includes seminars on making fieldwork more inclusive and meeting new curriculum requirements.`,
    category: 'Exhibition',
    format: 'In-Person',
    subjectAreas: ['Geography'],
    phases: ['Secondary', 'Further Education'],
    date: '2026-04-02',
    startTime: '10:00',
    endTime: '17:00',
    location: 'Edinburgh International Conference Centre',
    organiser: 'Geographical Association',
    organiserEmail: 'exhibitions@geography.org.uk',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-11',
    isFree: false,
    price: 20
  },
  {
    id: '11',
    title: 'History Teaching Webinar: Holocaust Education',
    description: 'Best practices for teaching the Holocaust with sensitivity and impact.',
    fullDescription: `Holocaust education requires particular care and expertise. This webinar provides guidance on teaching this difficult history with sensitivity while ensuring students understand its significance.

Featuring experts from the Holocaust Educational Trust, learn about available resources, survivor testimony projects, and approaches for different age groups.

CPD certificates provided for all attendees.`,
    category: 'Webinar',
    format: 'Virtual',
    subjectAreas: ['Humanities', 'English'],
    phases: ['Secondary'],
    date: '2026-01-27',
    startTime: '16:00',
    endTime: '17:30',
    location: 'Online via Microsoft Teams',
    organiser: 'Holocaust Educational Trust',
    organiserEmail: 'education@het.org.uk',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-12',
    isFree: true
  },
  {
    id: '12',
    title: 'School Leadership Conference Wales',
    description: 'Annual gathering of Welsh school leaders focusing on policy, practice, and innovation.',
    fullDescription: `The School Leadership Conference Wales brings together headteachers, deputies, and aspiring leaders from across Wales to discuss the unique challenges and opportunities in Welsh education.

Keynote speakers include the Education Minister and leading education researchers. Breakout sessions cover topics from curriculum reform to staff recruitment and retention.

An essential event for anyone in Welsh school leadership.`,
    category: 'Conference',
    format: 'In-Person',
    subjectAreas: ['Leadership'],
    phases: ['Primary', 'Secondary', 'Independent'],
    date: '2026-03-05',
    startTime: '09:00',
    endTime: '16:30',
    location: 'Cardiff City Hall',
    organiser: 'NAHT Cymru',
    organiserEmail: 'wales@naht.org.uk',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-13',
    isFree: false,
    price: 95
  },
  {
    id: '13',
    title: 'Computing Without Computers Workshop',
    description: 'Unplugged activities to teach computational thinking and programming concepts.',
    fullDescription: `Not every computing lesson needs a screen! This workshop introduces unplugged activities that teach core computational thinking concepts through games, puzzles, and physical activities.

Perfect for primary teachers and those teaching computing with limited technology resources. Leave with a toolkit of activities covering algorithms, data representation, and logical reasoning.

Suitable for teachers with any level of computing confidence.`,
    category: 'CPD Training',
    format: 'In-Person',
    subjectAreas: ['Technology', 'STEM'],
    phases: ['Primary'],
    date: '2026-02-12',
    startTime: '13:00',
    endTime: '16:00',
    location: 'Newcastle University',
    organiser: 'Computing At School',
    organiserEmail: 'workshops@computingatschool.org.uk',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-14',
    isFree: true
  },
  {
    id: '14',
    title: 'Assessment Without Levels Podcast',
    description: 'Live recording discussing innovative assessment approaches post-levels.',
    fullDescription: `Join the Assessment Without Levels podcast team for a special live recording exploring how schools are developing meaningful assessment systems since the removal of National Curriculum levels.

Hear from schools with innovative approaches, debate the pros and cons of different systems, and share your own experiences with the panel.

Refreshments and networking included.`,
    category: 'Podcast',
    format: 'Hybrid',
    subjectAreas: ['Assessment'],
    phases: ['Primary', 'Secondary'],
    date: '2026-02-25',
    startTime: '17:00',
    endTime: '19:30',
    location: 'Sheffield Hallam University / Online',
    organiser: 'Assessment Reform Group',
    organiserEmail: 'podcast@assessmentreform.org.uk',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-15',
    isFree: true
  },
  {
    id: '15',
    title: 'Outdoor Learning Festival',
    description: 'Celebrating outdoor education with workshops, demonstrations, and networking.',
    fullDescription: `Embrace the outdoors at this celebration of outdoor learning! From forest school techniques to adventure education, this festival showcases the power of learning beyond the classroom.

Workshops include bushcraft skills, outdoor maths activities, nature journaling, and risk-benefit assessment. Visit the exhibition area to discover outdoor learning providers and equipment.

Suitable for all education phases and outdoor experience levels.`,
    category: 'Festival',
    format: 'In-Person',
    subjectAreas: ['Wellbeing', 'Science'],
    phases: ['Primary', 'Nursery', 'Special Schools'],
    date: '2026-04-18',
    startTime: '09:30',
    endTime: '16:00',
    location: 'Peak District National Park',
    organiser: 'Institute for Outdoor Learning',
    organiserEmail: 'festival@outdoor-learning.org',
    image: 'https://images.unsplash.com/photo-1472746729193-36ad213ac4a5?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-16',
    isFree: false,
    price: 35
  },
  {
    id: '16',
    title: 'New Teacher Induction Webinar',
    description: 'Essential guidance for ECTs on surviving and thriving in your first year.',
    fullDescription: `Starting your teaching career? This webinar provides practical advice for Early Career Teachers on everything from classroom management to work-life balance.

Hear from experienced mentors and recently qualified teachers who share their tips for navigating the first year. Topics include building relationships, planning efficiently, and seeking support.

Free for all ECTs and their mentors.`,
    category: 'Webinar',
    format: 'Virtual',
    subjectAreas: ['Leadership', 'Wellbeing'],
    phases: ['Primary', 'Secondary'],
    date: '2026-01-20',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Online via Google Meet',
    organiser: 'The Education Endowment Foundation',
    organiserEmail: 'webinars@eef.org.uk',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'approved',
    submissionDate: '2026-01-17',
    isFree: true
  },
  // Pending events for admin approval
  {
    id: '17',
    title: 'AI in the Classroom Conference 2026',
    description: 'Exploring practical applications of artificial intelligence in K-12 education.',
    fullDescription: `This comprehensive conference explores how AI is transforming education, from adaptive learning platforms to AI-assisted assessment tools.

Join us for hands-on workshops, ethical discussions, and real-world case studies from schools already leveraging AI technology.

Perfect for educators curious about responsible AI integration in teaching and learning.`,
    category: 'Conference',
    format: 'Hybrid',
    subjectAreas: ['Technology', 'STEM', 'Assessment'],
    phases: ['Secondary', 'Further Education', 'Higher Education'],
    date: '2026-04-25',
    startTime: '09:00',
    endTime: '17:00',
    location: 'King\'s College London / Online',
    organiser: 'EdTech Innovators UK',
    organiserEmail: 'hello@edtechinnovators.co.uk',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'pending',
    submissionDate: '2026-01-18',
    isFree: false,
    price: 130
  },
  {
    id: '18',
    title: 'Early Years Music Workshop',
    description: 'Incorporating music and movement into nursery and reception settings.',
    fullDescription: `Music is a powerful tool for early years development. This workshop shows practitioners how to use songs, rhythm, and movement to support learning across all areas of the EYFS.

Led by an experienced early years music specialist, you'll learn simple techniques that require no musical training.

Take away a resource pack of songs and activities ready to use immediately.`,
    category: 'CPD Training',
    format: 'In-Person',
    subjectAreas: ['Wellbeing'],
    phases: ['Nursery', 'Primary'],
    date: '2026-03-22',
    startTime: '09:30',
    endTime: '12:30',
    location: 'Birmingham Conservatoire',
    organiser: 'Music Education Solutions',
    organiserEmail: 'workshops@musiceducation.org.uk',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'pending',
    submissionDate: '2026-01-19',
    isFree: false,
    price: 40
  },
  {
    id: '19',
    title: 'Behaviour Management Masterclass',
    description: 'Evidence-based strategies for creating positive classroom environments.',
    fullDescription: `Transform your approach to behaviour management with this intensive masterclass led by renowned behaviour expert Tom Bennett.

Explore the research behind effective behaviour policies, learn practical de-escalation techniques, and develop your personal behaviour toolkit.

Suitable for teachers at all career stages and leadership teams reviewing whole-school approaches.`,
    category: 'CPD Training',
    format: 'In-Person',
    subjectAreas: ['Wellbeing', 'Leadership'],
    phases: ['Primary', 'Secondary', 'Special Schools'],
    date: '2026-05-10',
    startTime: '09:00',
    endTime: '16:00',
    location: 'Nottingham Conference Centre',
    organiser: 'ResearchED',
    organiserEmail: 'cpd@researched.org.uk',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'pending',
    submissionDate: '2026-01-20',
    isFree: false,
    price: 95
  },
  {
    id: '20',
    title: 'Independent Schools Digital Strategy Summit',
    description: 'Strategic planning for technology in the independent sector.',
    fullDescription: `Designed specifically for leaders in independent schools, this summit addresses the unique challenges and opportunities of digital transformation in the private education sector.

Sessions cover everything from parental expectations around technology to balancing innovation with tradition.

Network with fellow independent school leaders and hear from technology vendors experienced in the sector.`,
    category: 'Conference',
    format: 'In-Person',
    subjectAreas: ['Technology', 'Leadership'],
    phases: ['Independent', 'Primary', 'Secondary'],
    date: '2026-05-22',
    startTime: '09:30',
    endTime: '16:00',
    location: 'The RSA, London',
    organiser: 'Independent Schools Council',
    organiserEmail: 'events@isc.co.uk',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'pending',
    submissionDate: '2026-01-21',
    isFree: false,
    price: 145
  },
  {
    id: '21',
    title: 'Dyslexia Awareness Webinar',
    description: 'Understanding and supporting dyslexic learners in mainstream classrooms.',
    fullDescription: `One in ten people are dyslexic. This webinar equips classroom teachers with the knowledge and strategies to support dyslexic learners effectively.

Learn to spot the signs, understand reasonable adjustments, and implement dyslexia-friendly teaching practices that benefit all students.

Free access provided by the British Dyslexia Association.`,
    category: 'Webinar',
    format: 'Virtual',
    subjectAreas: ['Inclusion', 'English'],
    phases: ['Primary', 'Secondary', 'Further Education'],
    date: '2026-04-08',
    startTime: '16:30',
    endTime: '18:00',
    location: 'Online via Zoom',
    organiser: 'British Dyslexia Association',
    organiserEmail: 'training@bdadyslexia.org.uk',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop',
    bookingUrl: 'https://example.com/book',
    featured: false,
    status: 'pending',
    submissionDate: '2026-01-22',
    isFree: true
  }
];

export const categories: EventCategory[] = [
  'Webinar',
  'Podcast',
  'Conference',
  'CPD Training',
  'Awards Show',
  'Festival',
  'Exhibition'
];

export const formats: EventFormat[] = ['In-Person', 'Virtual', 'Hybrid'];

export const subjectAreas: SubjectArea[] = [
  'English',
  'Maths',
  'Science',
  'STEM',
  'Leadership',
  'Technology',
  'Inclusion',
  'Assessment',
  'Wellbeing',
  'Humanities',
  'Geography'
];

export const eventPhases: EventPhase[] = [
  'Primary',
  'Secondary',
  'Further Education',
  'Higher Education',
  'Special Schools',
  'Nursery',
  'Independent'
];

export const getCategoryColor = (category: EventCategory): string => {
  const colors: Record<EventCategory, string> = {
    'Webinar': 'bg-category-webinar',
    'Podcast': 'bg-category-podcast',
    'Conference': 'bg-category-conference',
    'CPD Training': 'bg-category-cpd',
    'Awards Show': 'bg-category-awards',
    'Festival': 'bg-category-festival',
    'Exhibition': 'bg-category-exhibition'
  };
  return colors[category];
};
