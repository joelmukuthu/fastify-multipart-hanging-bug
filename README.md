# Reproduction for https://github.com/fastify/fastify-multipart/issues/497

This repo demonstrates how `@fastify/multipart` doesn't fulfil the
`for..await of` promise if an error is thrown while processing a single `file`.

Test it by running `node index.js`. The output will be something like:

```
running on port 42671
start processing file foo.txt
caught error while processing file foo.txt Error: write error
    at Writable.write [as _write] (fastify-multipart-hanging/index.js:21:22)
    at writeOrBuffer (node:internal/streams/writable:392:12)
    at _write (node:internal/streams/writable:333:10)
    at Writable.write (node:internal/streams/writable:337:10)
    at FileStream.ondata (node:internal/streams/readable:766:22)
    at FileStream.emit (node:events:514:28)
    at Readable.read (node:internal/streams/readable:539:10)
    at flow (node:internal/streams/readable:1023:34)
    at resume_ (node:internal/streams/readable:1004:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
done processing file foo.txt
```

Whereas if no error is thrown (remove the `new Error` on line 21):

```
running on port 38231
start processing file foo.txt
done processing file foo.txt
done processing all files
```

Notice that the first output does not contain the last line
`done processing all files` .
