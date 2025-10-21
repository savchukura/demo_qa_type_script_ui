import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

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
    fileName: string;
    mobileNumber: string;
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
    const fileName = faker.internet.displayName()
    const mobileNumber = faker.string.numeric(10)

    return { fullName,
             firstName,
             lastName,
             email,
             age,
             salary,
             department,
             currentAddress,
             permanentAddress,
             fileName,
             mobileNumber
        };
};


export function generateTxtFile(fileName: string, content: string): string {
  const dirPath = path.resolve(__dirname, '../testData');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, `${fileName}.txt`);
  fs.writeFileSync(filePath, content, 'utf8');

  return filePath;
}

export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}



