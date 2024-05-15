const { createLogger, transports, format } = require('winston');
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'Logs'); // Define the path to the Logs folder

const authLogger = createLogger({
    transports: [
        new transports.File({
            filename: path.join(logDirectory, 'auth.log'), // Log file for auth logs
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: path.join(logDirectory, 'auth-error.log'), // Log file for auth error logs
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

const userLogger = createLogger({
    transports: [
        new transports.File({
            filename: path.join(logDirectory, 'user.log'), // Log file for user logs
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: path.join(logDirectory, 'user-error.log'), // Log file for user error logs
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

const questionLogger = createLogger({
    transports: [
        new transports.File({
            filename: path.join(logDirectory, 'question.log'), // Log file for question logs
            level: 'info',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.File({
            filename: path.join(logDirectory, 'question-error.log'), // Log file for question error logs
            level: 'error',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

module.exports = {
    authLogger,
    userLogger,
    questionLogger
};
