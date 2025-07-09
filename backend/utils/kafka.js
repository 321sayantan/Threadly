import {Kafka} from "kafkajs";

export const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["192.168.0.102:9092"],
});

let producer = null;

async function createProducer(){
  if(producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  return producer;
}

export async function produceMessage(newMessage)
{
  await createProducer();
  await producer.send({
    topic: "messages-topic",
    messages: [{ key: `message-${Date.now()}`, value: JSON.stringify(newMessage) }],
  });
  console.log("Message produced to the Kafka Broker")
  return true;
}

export const kafkaProducer = kafka.producer();

// export default kafka;