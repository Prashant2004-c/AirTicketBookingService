const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT : process.env.PORT,
    flight_service_path: process.env.flight_service_path,
    get_user_path: process.env.get_user_path,
    send_mail_path: process.env.send_mail_path,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    email_id: process.env.email_id
}