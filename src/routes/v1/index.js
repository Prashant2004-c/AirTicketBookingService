const express = require('express');

// const { createChannel } = require('../../utils/messageQueue');
// const channel = await createChannel();
const  {BookingController}  = require('../../controllers/index');
const bookingController = new BookingController();

const router = express.Router();
router.get('/info', (req,res) => {
    return res.json({
        message: 'Booking API'
    })
})
router.post('/bookings', bookingController.create);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;