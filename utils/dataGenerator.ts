import { faker } from '@faker-js/faker';

interface UserData {
    fullName: string;
    email: string;
    currentAddress: string;
    permanentAddress: string;
};

export function generateUserData(): UserData {
    const fullName = faker.person.fullName();
    const email = faker.internet.email();
    const currentAddress = faker.location.streetAddress();
    const permanentAddress = faker.location.streetAddress();

    return { fullName,
             email,
             currentAddress,
             permanentAddress
        };
};

