import {EventModel} from './types';
import {createFile} from "./utils.ts";

export async function createEventModelFormData(event: EventModel) {

    const formData = new FormData();
    const poster = await createFile({url: event.poster, name: 'poster'});
    const cover = await createFile({url: event.cover, name: 'cover'});



    formData.append('eventName', event.eventName);
    formData.append('eventHostId', event.eventHostId);
    formData.append('poster', poster);
    formData.append('eventDate', event.eventDate.toISOString());
    formData.append('location', event.location || event.venue.name);
    formData.append('cover', cover);
    formData.append('_id', event._id);
    formData.append('description', event.description);
    formData.append('category', event.category);


    // Tickets
    event.ticketInfo.forEach((ticket, index) => {
        // formData.append(`ticketInfo[${index}].id`, ticket.id);
        formData.append(`ticketInfo[${index}][ticketType]`, ticket.ticketType);
        formData.append(`ticketInfo[${index}][price]`, ticket.price.toString());
        formData.append(`ticketInfo[${index}][ticketsAvailable]`, ticket.ticketsAvailable.toString());
        formData.append(`ticketInfo[${index}][ticketsLeft]`, ticket.ticketsAvailable.toString());
        formData.append(`ticketInfo[${index}][sold]`, ticket.sold.toString());
        if (ticket.saleEnd) {
            formData.append(`tickets[${index}][saleEnd]`, (ticket.saleEnd instanceof Date)? ticket.saleEnd.toISOString() : ticket.saleEnd);
        }
        if (ticket.saleStart ) {
            formData.append(`tickets[${index}][saleStart]`, (ticket.saleStart instanceof Date)? ticket.saleStart.toISOString() : ticket.saleStart);
        }
    });

    // Discounts
    if (event.discount) {
        event.discount.forEach((discount, index) => {
            formData.append(`discount[${index}].id`, discount.id);
            discount.ticketIds.forEach((ticketId, ticketIndex) => {
                formData.append(`discount[${index}].ticketIds[${ticketIndex}]`, ticketId);
            });
            formData.append(`discount[${index}].type`, discount.type);
            formData.append(`discount[${index}].value`, discount.value.toString());
            formData.append(`discount[${index}].start`, discount.start.toISOString());
            formData.append(`discount[${index}].end`, discount.end.toISOString());
        });
    }

    formData.append('createdAt', event.createdAt.toISOString());
    if (event.startSalesDate) {
        formData.append('startSalesDate', event.startSalesDate.toISOString());
    }
    if (event.endSalesDate) {
        formData.append('endSalesDate', event.endSalesDate.toISOString());
    }
    if (event.eventEnd) {
        formData.append('eventEnd', event.eventEnd);
    }
    if (event.minAge) {
        formData.append('minAge', event.minAge.toString());
    }
    if (event.dress) {
        formData.append('dress', event.dress);
    }
    if (event.lastEntry) {
        formData.append('lastEntry', event.lastEntry);
    }
    formData.append('country', event.country);
    formData.append('currency', event.currency);
    // formData.append('approved', event.approved.toString());

    // Venue
    formData.append('venue[name]', event.venue.name);
    formData.append('venue[street]', event.venue.street);
    formData.append('venue[city]', event.venue.city);
    formData.append('venue[country]', event.venue.country);
    formData.append('venue[district]', event.venue.district);
    formData.append('venue[saved]', event.venue.saved.toString());
    if (event.venue.id) {
        formData.append('venue[id]', event.venue.id);
    }
    console.log(event,formData.get('country'))
    return formData;
}