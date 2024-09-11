
// Function to generate fake events using Faker
import {faker} from "@faker-js/faker";
import {EventModel, EventType, Ticket, Venue} from "./types";

export function generateEvents(count: number): EventModel[] {
    const events: EventModel[] = [];

    for (let i = 0; i < count; i++) {
        const eventType = faker.helpers.objectValue(EventType); // Random event category
        const ticketCount = faker.number.int({ min: 3, max: 5 }); // Generate 1 to 3 ticket types per event

        // Generate tickets
        const tickets: Ticket[] = Array.from({ length: ticketCount }, () => {
            const stock = faker.number.int({min: 50, max: 1000});
            return ({
                id: faker.string.alphanumeric(6),
                name: faker.commerce.productName(),
                price: faker.number.float({min: 10, max: 300, multipleOf: 0.01}),
                // description: faker.lorem.sentence(),
                stock: stock,
                sold: faker.number.int({min: 0, max: stock}),
            });
        });
        const venueSaved = faker.datatype.boolean();
        // Generate event details
        const event: EventModel = {
            name: faker.company.catchPhraseNoun(),
            poster: faker.image.urlLoremFlickr({ category:'poster'}), // Event poster
            date: faker.date.future(), // Random future date
            location: faker.location.city() + ', ' + faker.location.country(),
            price: faker.number.float({ min: 20, max: 500, multipleOf: 0.01 }), // Base price
            cover: faker.image.urlLoremFlickr({category: 'concert'}), // Event cover image
            id: faker.string.alphanumeric(8), // Unique event ID
            category: eventType as EventType, // Random event category
            tickets: tickets, // Tickets array
            description: faker.lorem.paragraphs({min: 2, max: 3}),
            venue: {
                name: faker.word.noun(),
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                saved: venueSaved,
                id: venueSaved ? faker.string.alphanumeric(8) : undefined,
                district: faker.location.state()
            }
        };

        events.push(event);
    }

    return events;
}

export function generateVenues(count: number, {id}: {id?: string}): Venue[] {
    const venues:Venue[] = [];
     {
        for (let i = 0; i < count; i++) {
            const venue: Venue = {
                name: faker.word.noun({strategy: 'fail'}),
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                district: faker.location.state(),
                id: id ? id : faker.string.alphanumeric(8),
                links: [
                    {
                        name: 'Website',
                        url: faker.internet.url(),
                    }
                ],
                followers: faker.number.int({min: 2, max: 300}),
                cover: faker.image.urlLoremFlickr({category: 'venue'}),
                capacity: faker.number.int({min: 2, max: 400}),
                type: faker.word.sample({strategy: 'fail'}),
                yearEvents: faker.number.int(40),
                phone: faker.phone.number({style: "international"}),
                email: faker.internet.email({}),
            };
            venues.push(venue);
        }
    }

    return venues;
}