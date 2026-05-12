import express from "express";
import db from "../../../packages/db/dist";

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
  // add zod validations
  //use webhook secret to choose that the req actually came from hdfc bank.
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  const tnx = await db.onRampTransaction.findFirst({
    where: {
      token: paymentInformation.token,
    },
  });

  if (tnx?.status != "Processing") {
    return res.status(411).json({
      message: "request already processed.",
    });
  }
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
    res.json({
      message: "captured",
    });
  } catch (e) {
    console.log(e);
    db.onRampTransaction.update({
      where: {
        token: paymentInformation.token,
      },
      data: {
        status: "Failure",
      },
    }),
      res.status(411).json({
        message: "Error while processing webhook",
      });
  }
  // update balance in db
});

app.listen(3003, () => {
  console.log("Bank webhook listening on port 3003");
});
