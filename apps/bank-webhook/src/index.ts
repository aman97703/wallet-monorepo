const express = require("express");
const app = express();
const port = 5000;
import db from "@repo/db/client";

app.post("/hdfcWebhook", async (req: any, res: any) => {
  //TODO: Add zod validation here?
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  // Update balance in db, add txn
  try {
    await db.$transaction([
      db.balance.update({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),

      db.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.status(200).send("Captured");
  } catch (error) {
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
