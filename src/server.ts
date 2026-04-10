import { Server } from "http";
import app from "./app.js";

const port = process.env.PORT || 5000;

let server: Server;

async function bootstrap() {
    try {
        server = app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    } catch (err) {
        console.error(err);
    }
}

bootstrap();

process.on("unhandledRejection", (error) => {
    console.log(`😈 unhandledRejection is detected , shutting down ...`, error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on("uncaughtException", () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});