const axios = require('axios');
const { BookingRepository } = require('../repository/index');
const { flight_service_path } = require('../config/serverConfig');
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
            // console.log(getFlightRequestURL,'\n',updateFlightRequestURL);
            // console.log(booking.flightId, flightId);
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status: 'Booked'});
            return finalBooking;

        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;