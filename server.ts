import { listenAndServe } from 'https://deno.land/std@v0.51.0/http/server.ts';
import { acceptWebSocket, acceptable } from 'https://deno.land/std@v0.51.0/ws/mod.ts';
import { chat } from './chat.ts';
import { config } from './config.ts';
import { parse } from "https://deno.land/std@v0.51.0/flags/mod.ts";

const args = parse(Deno.args, {
    default: {
        port: config.port,
    }
})


listenAndServe({ port: args.port }, async (req) => {
    if (req.method === 'GET' && req.url === '/') {
        req.respond({
            status: 200,
            headers: new Headers({ 'Content-Type': 'text/html'}),
            body: await Deno.open('./index.html')
        });
    }

    // Websockets Chat
    if (req.method === 'GET' && req.url === '/ws') {
        if (acceptable(req)) {
            acceptWebSocket({
                conn: req.conn,
                bufReader: req.r,
                bufWriter: req.w,
                headers: req.headers
            }).then(chat);
        }
    }
});

console.log(`Serve running on 0.0.0.0:${args.port}`);