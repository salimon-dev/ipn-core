import { Request, Response } from "express";
import { UsersModel } from "../models/user";
import { TransactionsModel } from "../models/transaction";
import { md5 } from "../utils";

export default async function preTest(req: Request, res: Response) {
  await UsersModel.create({
    name: "testuser1",
    nickName: "test user 1",
    password: md5("testuser1"),
  });
  const testUser1 = await UsersModel.findOne({ name: "testuser1" });
  if (testUser1) {
    // delete all transactions
    await TransactionsModel.deleteMany({ "src._id": testUser1._id.toString() });
    await TransactionsModel.deleteMany({ "dst._id": testUser1._id.toString() });
    await testUser1.deleteOne();
  }
  const testUser2 = await UsersModel.findOne({ name: "testuser2" });
  if (testUser2) {
    // delete all transactions
    await TransactionsModel.deleteMany({ "src._id": testUser2._id.toString() });
    await TransactionsModel.deleteMany({ "dst._id": testUser2._id.toString() });
    await testUser2.deleteOne();
  }
  const testUser3 = await UsersModel.findOne({ name: "testuser3" });
  if (testUser3) {
    // delete all transactions
    await TransactionsModel.deleteMany({ "src._id": testUser3._id.toString() });
    await TransactionsModel.deleteMany({ "dst._id": testUser3._id.toString() });
    await testUser3.deleteOne();
  }
  res.send({
    message: "test env cleaned",
  });
}
