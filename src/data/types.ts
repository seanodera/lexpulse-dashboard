
export enum EventType {
    Clubbing = "clubbing",
    Comedy = "comedy",
    Festival = "festival",
    Concerts = "concerts",
    Sports = "sports",
    Theater = "theater",
    Conference = "conference",
    Exhibition = "exhibition",
    Workshop = "workshop",
    Seminar = "seminar",
    Movie = "movie",
}

// Extract constant array for potential reuse and increased readability
export const EventTypeList = [
    EventType.Clubbing,
    EventType.Comedy,
    EventType.Festival,
    EventType.Concerts,
    EventType.Sports,
    EventType.Theater,
    EventType.Conference,
    EventType.Exhibition,
    EventType.Workshop,
    EventType.Seminar,
    EventType.Movie
];

export interface EventModel {
    eventName: string;
    eventHostId: string;
    poster: string;
    eventDate: Date; // Event date
    location: string;
    // price: number;
    cover: string;
    _id: string;
    description: string;
    category: EventType;
    ticketInfo: Ticket[];
    discount?: Discount[];
    createdAt: Date;
    startSalesDate?: Date; // Optional
    endSalesDate?: Date; // Optional
    eventEnd?: string; // Optional
    minAge?: number; // Optional minimum age restriction
    dress?: string; // Optional dress code
    lastEntry?: string;
    country: string;
    currency: string;
    approved: boolean;
    venue: {
        name: string;
        street: string;
        city: string;
        country: string;
        district: string;
        saved: boolean;
        id?: string;
    };
}

export interface Ticket {
    _id: string;
    ticketType: string;
    price: number;
    ticketsAvailable: number;
    ticketsLeft: number;
    sold: number;
    saleEnd?: Date; // Optional
    saleStart?: Date; // Optional
}

export interface Discount {
    id: string;
    ticketIds: string[];
    type: 'FlatRate' | 'Percentage';
    value: number;
    start: Date;
    end: Date;
}

export interface Venue {
    id: string;
    name: string;
    street: string;
    city: string;
    district: string;
    country: string;
    links: { name: string, url: string }[];
    followers: number;
    cover: string;
    capacity: number;
    type: string;
    yearEvents: number | 0;
    description?: string;
    phone: string;
    email: string;
}

export interface Purchase {
    id: string;
    user: string;
    eventName: string;
    ticketQuantity: number;
    purchaseDate: string;
    totalAmount: number;
}
