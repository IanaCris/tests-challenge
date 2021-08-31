import { app } from "../../../../app";
import request from "supertest";

describe("Create Statement Controller", () => {
  it("should be able create a new statement", async () => {
    const response = await request(app).post("/statement/deposit")
      .send({
        amount: 15,
        description: "Deposito salario"
      });

    // console.log(response.status);
  });
});
