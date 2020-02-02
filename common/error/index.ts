
export const errorMessage = (title: string, errors: any[]) => {
    errors.forEach(error => {
        switch (error.code) {
            case "string.base":
                error.message = `${title} must be a string!`;
                break;
            case "date.base":
                error.message = `${title} must be a date!`;
                break;
            case "string.empty":
                error.message = `${title} should not be empty!`;
                break;
            case "string.max":
                error.message = `${title} must be less than or equal to 10 characters!`;
                break;
            case "string.min":
                error.message = `${title} must be greater than or equal to 8 characters!`;
                break;
            default:
                break;
        }
    });
    return errors;
};

export const check = (checker: any, key: any) => {
    switch (key) {
        case 'EXISTED': // length = 0 là chưa tồn tại => false
            return checker.recordset.length ? true : false;
        case 'NOT_CHANGED':// length = 0 là update/create thất bại => true
            return checker.rowsAffected.length ? false : true
        case 'NOT_DELETED':// length = 0 là delete thành công => true
            return checker.rowsAffected.length ? false : true
        default:
            throw new Error('Key not found');
    }
};