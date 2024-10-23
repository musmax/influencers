import colors from 'colors';

const logger = {
    info:    (text) => console.log(`${text}`),
    success: (text) => console.log(`${text}`.green),
    warning: (text) => console.log(`${text}`.yellow),
    error:   (text) => console.log(`${text}`.red)
};

export default logger;
