const { StatusCodes } = require('http-status-codes');
const { BookingService } = require('../services/index');

const { createChannel, publishMessage } = require('../utils/messageQueue');
const  { REMINDER_BINDING_KEY } = require('../config/serverConfig');
const bookingService = new BookingService();

class BookingController {

    async sendMessageToQueue(req, res) {
        const channel = await createChannel();
        const payload = {
            data: {
                subject: 'This is a notification from queue',
                content: 'some queue will subscribe this',
                recepientEmail: 'prashantvashisth347@gmail.com',
                notificationTime: '2025-02-20T16:32:39'
            },
            service: 'CREATE_TICKET'
        };
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json({
            message: 'Succesfully published the event'
        });
    }

    async create(req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully Completed Booking',
                success: true,
                err: {},
                data: response
            });
        } catch (error) {
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                success: false,
                err: error.explanation || {},
                data: {}
            });
        }
    }
}

module.exports = BookingController;





