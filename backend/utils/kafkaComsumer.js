import conversation from "../Models/conversation.model.js";
import Message from "../Models/message.model.js";
import { kafka } from "./kafka.js";

export async function startMessageConsumer() {
  console.log("consumer is running");
  const consumer = kafka.consumer({
    groupId: "message",
    maxWaitTimeInMs: 10000,
    // minBytes: 100,
    // autoCommitInterval: 5000,
    // autoCommit: true,
  });
  consumer.connect();

  await consumer.subscribe({ topic: "messages-topic", fromBeginning: false });

  await consumer.run({
    eachBatchAutoResolve: true,
    maxWaitTimeInMs: 10000,
    // eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
    //     console.log("10000")
    //   console.log(
    //     `[${topic}]: partition:${partition}:`,
    //     message.value.toString()
    //   );
    // },
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
      uncommittedOffsets,
      isRunning,
      isStale,
      pause,
    }) => {
      const messages = [];
      const conversationMap = new Map(); // conversationID -> array of message _ids
      const lastmessageMap = {}; // conversationID -> array of message _ids

      for (let message of batch.messages) {
        if (!isRunning() || isStale()) break;

        const msg = JSON.parse(message.value.toString());
        console.log(msg);

        const { senderID, receiverID, conversationID, text, seen, createdAt } = msg;

        messages.push({
          senderID,
          receiverID,
          text,
          conversationID,
          createdAt,
          seen,
        });

        resolveOffset(message.offset);
        await heartbeat();
      }

      if (messages.length === 0) return;

      try {
        console.log("started inserting");
        const insertedMessages = await Message.insertMany(messages);
        // console.log(insertedMessages)
        for (const msg of insertedMessages) {
          const id = msg.conversationID;
          if (!conversationMap.has(id)) conversationMap.set(id, []);
          conversationMap.get(id).push(msg._id);
          // if (!lastmessageMap.has(id)) lastmessageMap.set(id, "");
          lastmessageMap[id] = msg.text;
        }

        for (const [convID, msgIDs] of conversationMap.entries()) {
          console.log(lastmessageMap[convID])
          await conversation.findByIdAndUpdate(
            convID,
            {
              $push: { messages: { $each: msgIDs } },
              $set: { lastMessage: lastmessageMap[convID] },
            },
            { upsert: true }
          );
        }
      } catch (error) {
        console.log(error);
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: ["messages-topic"] }]);
        }, 60 * 1000);
      }
    },
  });
}
