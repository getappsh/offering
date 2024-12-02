import { SuperAgentTest, agent as supertest } from 'supertest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as dotenv from "dotenv";
import { LOGIN, REFRESH } from '@app/root/api/src/utils/paths';
import { createProjectUntilUploadTest, discoveryTest, importCreateTest } from './tests';


dotenv.config();

expect.extend({
  async toBeValidWithClassValidator(received, expectedClass) {
    const receivedObject = plainToInstance(expectedClass, received);
    const validationErrors = await validate(receivedObject);
    const pass = validationErrors.length === 0;

    return {
      pass,
      message: () => {
        if (pass) {
          return `Expected object not to be valid with class-validator`;
        } else {
          const formattedErrors = validationErrors
            .map((error) => Object.values(error.constraints))
            .join(', ');
          return `Expected object to be valid with class-validator, but got validation errors: ${formattedErrors}`;
        }
      },
    };
  },
});



describe('Integration Test', () => {
  let request: SuperAgentTest;
  let awsReq: SuperAgentTest;

  beforeAll(async () => {
    request = supertest(process.env.SERVER_URL);
    awsReq = supertest("");


    const loginResponse = await request.post(LOGIN).send({
      "username": process.env.TEST_USERNAME,
      "password": process.env.TEST_PASSWORD
    }).expect(201)

    const refreshResponse = await request.post(LOGIN + REFRESH).send({
      refreshToken: loginResponse.body.refreshToken
    }).expect(201)

    request.auth(refreshResponse.body.accessToken, { type: 'bearer' })
  });

  it("From project creating until upload version test", async () => createProjectUntilUploadTest(request, awsReq))
  it("Discovery software and maps test", async () => discoveryTest(request))
  it("Get map import create test", async () => importCreateTest(request))

});

