import amqp from "amqplib";

let connection, channel;

async function start() {
    let retries = 5;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    while (retries > 0) {
        try {
            connection = await amqp.connect("amqp://rabbitmq_node");
            channel = await connection.createChannel();

            await channel.assertQueue("task_created");

            console.log("Notification service is listening...");

            channel.consume("task_created", (msg) => {
                try {
                    const taskData = JSON.parse(msg.content.toString());
                    console.log("🔔 New Task Notification:", taskData.title);
                    console.log(taskData);
                } catch (err) {
                    console.error("Invalid message:", err);
                }

                channel.ack(msg);
            });

            return;
        } catch (error) {
            console.error("RabbitMQ connection error:", error.message);
            retries--;
            console.log(`Retrying in 3s... (${retries} retries left)`);
            await delay(3000);
        }
    }

    console.error("❌ Failed to connect to RabbitMQ after retries");
}

start();
