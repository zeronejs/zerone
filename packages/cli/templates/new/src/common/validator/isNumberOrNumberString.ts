import { registerDecorator, ValidationOptions, isNumber, isNumberString } from 'class-validator';

export function IsNumberOrNumberString(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
        registerDecorator({
            name: 'isNumberOrNumberString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any) {
                    const res = isNumber(value) || isNumberString(value);
                    return res;
                    // you can return a Promise<boolean> here as well, if you want to make async validation
                },
            },
        });
    };
}
