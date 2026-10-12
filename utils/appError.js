module.exports = (status, message, statusText) => {
    const error = new Error();
    error.status = status;
    error.message = message;
    error.statusText = statusText;
    return error;
}