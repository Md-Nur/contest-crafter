const express = require("express");
const env = require("dotenv");
env.config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: [
      // "http://localhost:5173",
       "https://contest-crafter.web.app"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello Contest Crafter");
});

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.rgf5l2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const db = client.db("contestCrafter");
    const contests = db.collection("contests");
    const users = db.collection("users");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    // middlewares
    const verifyToken = (req, res, next) => {
      // console.log('inside verify token', req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      // console.log(token);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await users.findOne(query);

      if (!user.isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await users.find().toArray();
      if (!result) {
        return res.status(404).send({ message: "No user found" });
      }
      res.send(result);
    });

    app.get("/users/:uid", async (req, res) => {
      // console.log(req.params.uid);
      const user = await users.findOne({ uid: req.params.uid });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      res.json(user);
    });

    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;

      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = { email: email };
      const user = await users.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.isAdmin;
      }
      res.send({ admin });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // insert email if user doesnt exists:
      // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
      const query = { email: user.email };
      const existingUser = await users.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }

      try {
        await users.insertOne(user);
        const result = await users.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "error in inserting user" });
      }
    });

    app.put("/users/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = req.body;
      const newValues = { $set: user };
      const result = await users.updateOne(query, newValues);
      if (result) {
        const updatedUser = await users.findOne(query);
        res.send(updatedUser);
      }
    });

    app.put("/users-admin/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const { role } = req.body;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          isAdmin: role === "admin",
          isCreator: role === "creator" || role === "admin",
        },
      };
      const result = await users.updateOne(filter, updatedDoc);
      res.send({ random: Math.random() });
    });
    app.patch(
      "/users-block/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const oldUser = await users.findOne(filter);
        const updatedDoc = {
          $set: {
            isBlocked: !oldUser.isBlocked,
          },
        };
        await users.updateOne(filter, updatedDoc);
        res.send({ random: Math.random() });
      }
    );

    app.delete("/users/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await users.deleteOne(query);
      res.send(result);
    });

    //Contest related api

    app.get("/contests", async (req, res) => {
      const query = req.query;
      if (query.limit && query.sort) {
        const contestList = await contests
          .find({
            status: {
              name: "confirmed",
              msg: "Contest Confirmed",
            },
          })
          .sort({ [query.sort]: query.sorOrder === "asc" ? 1 : -1 })
          .limit(parseInt(query.limit))
          .toArray();
        res.json(contestList);
      } else if (query.search) {
        const contestList = await contests
          .find({
            contestType: { $regex: query.search, $options: "i" },
            status: {
              name: "confirmed",
              msg: "Contest Confirmed",
            },
          })
          .toArray();
        res.json(contestList);
      } else {
        const contestList = await contests
          .find({
            status: {
              name: "confirmed",
              msg: "Contest Confirmed",
            },
          })
          .toArray();
        res.json(contestList);
      }
    });

    app.post("/contest", verifyToken, async (req, res) => {
      const contest = req.body;

      if (req.decoded._id !== contest.creator.userId) {
        return res.status(403).send("Unauthorized");
      }

      const result = await contests.insertOne(contest);
      const user = await users.findOne({
        _id: new ObjectId(contest.creator.userId),
      });
      if (!user.createdContests) {
        user.createdContests = [];
      }
      user.createdContests.push(result.insertedId);
      await users.updateOne(
        { _id: new ObjectId(contest.creator.userId) },
        {
          $set: {
            createdContests: user.createdContests,
          },
        }
      );
      res.send(result);
    });

    app.get("/contest-winner", async (req, res) => {
      const latestContests = await contests.findOne(
        {
          status: {
            name: "confirmed",
            msg: "Contest Confirmed",
          },
        },
        { sort: { _id: -1 } }
      );
      const totalWinners = await contests
        .find({}, { winner: { $exists: true } })
        .toArray();
      const totalContests = await contests.find().toArray();

      res.json({
        ...latestContests,
        totalWinners: totalWinners.length,
        totalContests: totalContests.length,
        totalParticipants: totalContests.reduce(
          (acc, contest) => acc + contest.participationCount,
          0
        ),
      });
    });

    app.get("/best-contest", async (req, res) => {
      const bestContest = await contests.findOne(
        {
          status: {
            name: "confirmed",
            msg: "Contest Confirmed",
          },
        },
        { sort: { participationCount: -1 } }
      );
      res.json(bestContest);
    });

    app.get("/contest/:id", verifyToken, async (req, res) => {
      const contest = await contests.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(contest);
    });

    app.patch(
      "/confirm-contest/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const contest = await contests.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (contest.status.name === "confirmed") {
          return res.status(400).send("Contest already confirmed");
        }

        const result = await contests.updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              status: {
                name: "confirmed",
                msg: "Contest Confirmed",
              },
            },
          }
        );

        res.send({ random: Math.random() });
      }
    );

    app.put(
      "/contest-comment/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const contest = await contests.findOne({
          _id: new ObjectId(req.params.id),
        });

        if (!contest) {
          return res.status(404).send("Contest not found");
        }

        await contests.updateOne(
          { _id: new ObjectId(req.params.id) },
          {
            $set: {
              status: {
                name: "pending",
                msg: req.body.comment,
              },
            },
          }
        );

        res.send({ random: Math.random() });
      }
    );

    app.get("/contests-admin", verifyToken, verifyAdmin, async (req, res) => {
      const contestList = await contests.find().toArray();
      res.json(contestList);
    });

    // Payment related api

    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price) * 100;

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        payment_method_types: ["card"],
        // automatic_payment_methods: {
        //   enabled: true,
        // },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/payment-success", verifyToken, async (req, res) => {
      const { contestId, userId } = req.body;
      if (userId !== req.decoded._id) {
        return res.status(403).send("Unauthorized");
      }
      const contest = await contests.findOne({
        _id: new ObjectId(contestId),
      });
      if (!contest.participants.includes(userId)) {
        await contests.updateOne(
          { _id: new ObjectId(contestId) },
          {
            $push: {
              participants: userId,
            },
            $inc: {
              participationCount: 1,
            },
          }
        );
        await users.updateOne(
          { _id: new ObjectId(userId) },
          {
            $push: {
              participateContests: contestId,
            },
          }
        );
      }

      res.send("Payment Success");
    });

    // Dashboard related api

    app.get("/user-contests/:id", verifyToken, async (req, res) => {
      if (String(req.params.id) !== String(req.decoded._id)) {
        return res.status(403).send("Unauthorized");
      }

      const allContests = await contests.find().toArray();

      let userContests = allContests.filter((contest) =>
        contest.participants.includes(req.params.id)
      );

      if (req.query.sortingByDate === "-1") {
        userContests = userContests.filter((contest) => {
          const now = new Date().getTime();
          const deadlineD = new Date(contest.deadline).getTime();
          const distance = deadlineD - now;
          if (distance > 0) {
            return contest;
          }
        });
        userContests.sort((a, b) => {
          return new Date(a.deadline) - new Date(b.deadline);
        });
      }

      res.json(userContests);
    });

    app.get("/win-contests/:id", verifyToken, async (req, res) => {
      if (String(req.params.id) !== String(req.decoded._id)) {
        return res.status(403).send("Unauthorized");
      }

      const allContests = await contests.find().toArray();

      let userContests = allContests.filter(
        (contest) => contest.winner.userId === req.params.id
      );

      if (userContests.length === 0) {
        return res.status(404).send("No contest won by user");
      }

      res.json(userContests);
    });

    app.get("/created-contest/:id", verifyToken, async (req, res) => {
      if (String(req.params.id) !== String(req.decoded._id)) {
        return res.status(403).send("Unauthorized");
      }

      const userContests = await contests
        .find({
          "creator.userId": req.params.id,
        })
        .toArray();
      if (userContests.length === 0) {
        return res.status(404).send("No contest created by user");
      }

      res.json(userContests);
    });

    app.delete("/contest/:id", verifyToken, async (req, res) => {
      if (!req.params.id) {
        return res.status(404).send("Contest not found");
      }
      const contest = await contests.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!contest) {
        return res.status(404).send("Contest not found");
      }
      // if (req.decoded._id !== contest?.creator.userId) {
      //   return res.status(403).send("Unauthorized");
      // }
      const user = await users.findOne({
        _id: new ObjectId(contest.creator?.userId),
      });
      if (user?.createdContests) {
        const createdContests = user.createdContests.filter(
          (contestId) => contestId !== req.params.id
        );
        await users.updateOne(
          { _id: new ObjectId(contest.creator.userId) },
          {
            $set: {
              createdContests: createdContests,
            },
          }
        );
      }

      const updateUser = await users.findOne({
        _id: new ObjectId(user._id),
      });

      await contests.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.send(req.decoded);
    });

    app.put("/contest/:id", verifyToken, async (req, res) => {
      const contest = req.body;
      if (!contest) {
        return res.status(404).send("Contest not found");
      }
      if (!contest.creator?.userId) {
        return res.status(400).send("Creator not found");
      }

      const query = { _id: new ObjectId(req.params.id) };
      const result = await contests.updateOne(query, { $set: contest });
      if (contest.creator?.userId === req.decoded._id) {
        const updateUser = await users.findOne({
          _id: new ObjectId(contest.creator.userId),
        });
        res.send(updateUser);
      } else {
        res.send(result);
      }
    });

    app.get("/contests-submission/:id", async (req, res) => {
      const contest = await contests.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!contest) {
        return res.status(404).send("Contest not found");
      }
      let submitted = [];

      if (contest.submission) {
        submitted = await users
          .find({
            _id: {
              $in: contest.submission.map((sub) => new ObjectId(sub.userId)),
            },
          })
          .toArray();
      }

      res.json(submitted);
    });

    app.post("/contest-winner-dec", verifyToken, async (req, res) => {
      const { contestId, winnerId } = req.body;
      const contest = await contests.findOne({
        _id: new ObjectId(contestId),
      });
      if (contest.creator.userId !== req.decoded._id) {
        return res.status(403).send("Unauthorized");
      }

      const winnerUser = await users.findOne({
        _id: new ObjectId(winnerId),
      });
      if (!winnerUser) {
        return res.status(404).send("Winner not found");
      }
      await users.updateOne(
        { _id: new ObjectId(winnerId) },
        {
          $push: {
            winningContests: contestId,
          },
        }
      );
      const result = await contests.updateOne(
        { _id: new ObjectId(contestId) },
        {
          $set: {
            winner: {
              userId: winnerId,
              imageUrl: winnerUser.photoURL,
              name: winnerUser.displayName,
            },
          },
        }
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
