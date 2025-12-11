const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whisockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const handler = require('./handler');

const logger = pino({ level: 'silent' });
const dataPath = path.join(__dirname, 'data');
const libsPath = path.join(__dirname, 'libs');

// Pastikan folder data ada
if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

// Inisialisasi file JSON jika belum ada
const initFiles = ['products.json', 'settings.json', 'admins.json', 'groups.json', 'orders.json', 'carts.json'];
initFiles.forEach(file => {
    const filePath = path.join(dataPath, file);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: config.qrCode,
        auth: state,
        generateHighQualityLinkPreview: true
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(`${config.botName} is now connected!`);
        }
    });

    // Handle messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        await handler.handle(sock, msg, config);
    });

    // Handle button responses
    sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            if (update.update.type === 'buttons_response_message') {
                // Handle button clicks, pass to handler
                await handler.handleButton(sock, update);
            }
        }
    });
}

startBot().catch(err => console.error('Error starting bot:', err));
