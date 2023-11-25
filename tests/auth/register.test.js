const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const baseURL = "http://localhost:" + (process.env["PORT"] || "8080");
const localServer = axios.create({ baseURL });

test("full validation error", async () => {
  try {
    const result = await localServer.post("/auth/register");
    console.log(result);
  } catch (err) {
    const { data, status } = err.response;
    expect(status).toBe(400);
    expect(data.length).toBe(3);
    expect(data[0].path).toBe("name");
    expect(data[1].path).toBe("nickName");
    expect(data[2].path).toBe("password");
  }
});

// Test for missing name
test("missing name validation error", async () => {
  try {
    const result = await localServer.post("/auth/register", {
      nickName: "testNickName",
      password: "testPassword",
    });
    console.log(result);
  } catch (err) {
    const { data, status } = err.response;
    expect(status).toBe(400);
    expect(data[0].path).toBe("name");
    expect(data.length).toBe(1);
  }
});

// Test for missing nickName
test("missing nickName validation error", async () => {
  try {
    const result = await localServer.post("/auth/register", {
      name: "testName",
      password: "testPassword",
    });
    console.log(result);
  } catch (err) {
    const { data, status } = err.response;
    expect(status).toBe(400);
    expect(data[0].path).toBe("nickName");
    expect(data.length).toBe(1);
  }
});

// Test for missing password
test("missing password validation error", async () => {
  try {
    const result = await localServer.post("/auth/register", {
      name: "testName",
      nickName: "testNickName",
    });
    console.log(result);
  } catch (err) {
    const { data, status } = err.response;
    expect(status).toBe(400);
    expect(data[0].path).toBe("password");
    expect(data.length).toBe(1);
  }
});

test("register test user 1", async () => {
  const { status, data } = await localServer.post("/auth/register", {
    name: "testuser1",
    nickName: "test user 1",
    password: "testuser1",
  });
  expect(status).toBe(200);
});

test("register test user 1 again", async () => {
  try {
    const { status, data } = await localServer.post("/auth/register", {
      name: "testuser1",
      nickName: "test user 1",
      password: "testuser1",
    });
  } catch (err) {
    const { data, status } = err.response;
    expect(status).toBe(400);
    expect(data[0].path).toBe("name");
    expect(data.length).toBe(1);
  }
});
test("register test user 2", async () => {
  const { status, data } = await localServer.post("/auth/register", {
    name: "testuser2",
    nickName: "test user 2",
    password: "testuser2",
    avatar: "bot1",
  });
  expect(status).toBe(200);
});
test("register test user 3", async () => {
  const { status, data } = await localServer.post("/auth/register", {
    name: "testuser3",
    nickName: "test user 3",
    password: "testuser3",
  });
  expect(status).toBe(200);
  expect(data.user.name).toBe("testuser3");
  expect(data.user.nickName).toBe("test user 3");
  expect(data.user.avatar).toBe("default");
  expect(data.token).toBeTruthy();
});
