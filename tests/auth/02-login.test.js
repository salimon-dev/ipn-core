const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const baseURL = "http://localhost:" + (process.env["PORT"] || "8080");
const localServer = axios.create({ baseURL });

test("login test user 1", async () => {
  const { status, data } = await localServer.post("/auth/login", {
    name: "testuser1",
    password: "testuser1",
  });
  expect(status).toBe(200);
  expect(status).toBe(200);
  expect(data.user.name).toBe("testuser1");
  expect(data.user.nickName).toBe("test user 1");
  expect(data.user.avatar).toBe("default");
  expect(data.token).toBeTruthy();
});
test("login test user 2", async () => {
  const { status, data } = await localServer.post("/auth/login", {
    name: "testuser2",
    password: "testuser2",
  });
  expect(status).toBe(200);
  expect(status).toBe(200);
  expect(data.user.name).toBe("testuser2");
  expect(data.user.nickName).toBe("test user 2");
  expect(data.user.avatar).toBe("bot1");
  expect(data.token).toBeTruthy();
});
test("login test user 3", async () => {
  const { status, data } = await localServer.post("/auth/login", {
    name: "testuser3",
    password: "testuser3",
  });
  expect(status).toBe(200);
  expect(status).toBe(200);
  expect(data.user.name).toBe("testuser3");
  expect(data.user.nickName).toBe("test user 3");
  expect(data.user.avatar).toBe("default");
  expect(data.token).toBeTruthy();
});
