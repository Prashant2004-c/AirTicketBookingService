const axios = require('axios');
const { BookingRepository } = require('../repository/index');
const { flight_service_path, get_user_path, send_mail_path, email_id } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${flight_service_path}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            // console.log(flight.data);
            // return flight.data.data;
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError(
                    'Something went wrong in the booking service',
                    'Insufficient seats in the flight'
                );
            }
            const totalCost = priceOfTheFlight * data.noOfSeats; 
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestURL = `${flight_service_path}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: 'Booked'});

            // now trying to send mail after completing the booking

            // first fetch the mail of the user
            const userId = data.userId;
            const getUserRequestURL = `${get_user_path}/api/v1/users/${userId}`;
            const user_response = await axios.get(getUserRequestURL);
            const user_data = user_response.data.data;
            const user_email = user_data.email;
            const mail_path_URL = `${send_mail_path}/api/v1/mails`;
            const emailResponse = await axios.post(mail_path_URL, {
                mailFrom: email_id,
                mailTo: user_email,
                mailSubject: 'Booking Confirmation',
                mailBody: `Hello, your ticket  has been confirmed!`
            });
            console.log('Email service response:', emailResponse.data);
            return finalBooking;

        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }


    async updateBooking(bookingId, data) {
        
    }
}

module.exports = BookingService;