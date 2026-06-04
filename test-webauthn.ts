import { generateRegistrationOptions } from "@simplewebauthn/server";
const options = await generateRegistrationOptions({
  rpName: "test",
  rpID: "localhost",
  userID: "testuser",
  userName: "testuser",
});
console.log(options);
