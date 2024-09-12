
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
    name: string;
    poster: string;
    date: Date; // Using Date object for better date manipulation
    location: string;
    price: number;
    cover: string;
    id: string;
    description: string;
    category: EventType;
    tickets: Ticket[];
    discount?: Discount[];
    createdAt: Date;
    minAge: number;
    dress: string;
    lastEntry?: string;
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

export interface Discount {
    id:string;
    ticketIds: string[];
    type: 'FlatRate' | 'Percentage';
    value: number;
    start: Date;
    end: Date;
}

export interface Ticket {
    id:string;
    name: string;
    price: number;
    // description: string;
    stock: number;
    sold: number;
    saleEnd?: Date;
    saleStart?: Date;
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
