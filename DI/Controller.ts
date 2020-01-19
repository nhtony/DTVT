//  Classes without decorators do NOT emit metadata, hence we need to decorate the controller class.
export const Controller = (): ClassDecorator => {
    return target => {
        // maybe do something with controller here
    };
};
