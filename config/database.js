const mongoose = require('mongoose');
const path = require('path');

const connectDB = async () => {
    try {
        const certPath = path.join(__dirname, 'certs', 'X509-cert.pem');

        console.log(certPath);
        console.log(process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            tlsCertificateKeyFile: certPath,
        });

        console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB; 