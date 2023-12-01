const fastify = require("fastify");
const { pipeline } = require("node:stream/promises");
const { request } = require("node:http");
const { Writable } = require("node:stream");
const { createReadStream } = require("node:fs");
const fastifyMultipart = require("@fastify/multipart");
const FormData = require("form-data");

const app = fastify()
  .register(fastifyMultipart)
  .post("/", async (request, reply) => {
    const files = await request.files();

    for await (const { file, filename } of files) {
      console.log("start processing file", filename);

      try {
        const storage = new Writable({
          write(chunk, encoding, callback) {
            // trigger error:
            callback(new Error("write error"));
          },
        });

        await pipeline(file, storage);
      } catch (error) {
        console.log("caught error while processing file", filename, error);
        // note that the error isn't rethrown here, so this error is now handled
        // and processing should proceed
      }

      console.log("done processing file", filename);
    }

    console.log("done processing all files");

    return reply.send(files);
  });

const run = async () => {
  await app.listen();

  const { port } = app.server.address();

  console.log("running on port", port);

  const form = new FormData();
  const opts = {
    hostname: "127.0.0.1",
    port,
    path: "/",
    headers: form.getHeaders(),
    method: "POST",
  };
  const req = request(opts);

  form.append("upload", createReadStream("./foo.txt"));
  form.pipe(req);
};

run();
