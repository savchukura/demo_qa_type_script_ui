import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';

interface UserData {
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
    currentAddress: string;
    permanentAddress: string;
};

export function generateUserData(): UserData {
    const fullName = faker.person.fullName();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const age = randomInt(18, 65).toString();
    const salary = randomInt(3000, 5000).toString();
    const department = faker.person.jobType()
    const currentAddress = faker.location.streetAddress();
    const permanentAddress = faker.location.streetAddress();

    return { fullName,
             firstName,
             lastName,
             email,
             age,
             salary,
             department,
             currentAddress,
             permanentAddress
        };
};

