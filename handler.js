const fs = require('fs');
const path = require('path');
const config = require('./config');
const { menu } = require('./libs/menu');
const { store } = require('./libs/store');
const { owner } = require('./libs/owner');
const { admin } = require('./libs/admin');
const { group } = require('./libs/group');
const { payment } = require('./libs/payment');
const { utils } = require('./libs/utils');
const { approval } = require('./libs/approval');

const dataPath = path.join(__dirname, 'data');

async function handle(sock, msg, config) {
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const body = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').trim();
    const prefix = config.prefix;
    if (!body.startsWith(prefix)) return;

    const command = body.slice(prefix.length).split(' ')[0].toLowerCase();
    const args = body.slice(prefix.length).trim().split(' ').slice(1);
    const sender = msg.key.participant || msg.key.remoteJid.split('@')[0];

    // Load users from carts.json or similar for verification
    let users = JSON.parse(fs.readFileSync(path.join(dataPath, 'carts.json'), 'utf8'));
    let isVerified = users.some(u => u.jid === sender);

    if (!isVerified) {
        await approval.verifyUser(sock, from, sender);
        return;
    }

    // Route commands
    switch (command) {
        case 'menu':
        case 'allmenu':
            await menu.allMenu(sock, from);
            break;
        case 'owner':
            await owner.ownerInfo(sock, from);
            break;
        case 'donate':
            await payment.donate(sock, from);
            break;
        case 'runtime':
        case 'ping':
        case 'profile':
        case 'limit':
        case 'saldo':
        case 'topup':
        case 'claim':
            await utils.infoCommand(sock, from, command);
            break;
        case 'addprem':
        case 'delprem':
        case 'setprefix':
        case 'broadcast':
        case 'addlimit':
        case 'addsaldo':
            if (sender === config.ownerNumber) {
                await owner.ownerCommands(sock, from, command, args);
            } else {
                await sock.sendMessage(from, { text: 'Hanya owner!' });
            }
            break;
        case 'ytmp3':
        case 'ytmp4':
        case 'tiktok':
        case 'igdl':
        case 'fbdl':
            await utils.downloader(sock, from, command, args[0]);
            break;
        // Store commands
        case 'store':
        case 'list':
            await store.listProducts(sock, from);
            break;
        case 'buy':
            await store.buyProduct(sock, from, args[0]);
            break;
        case 'cart':
            await store.viewCart(sock, from, sender);
            break;
        case 'checkout':
            await payment.checkout(sock, from, sender);
            break;
        // Group commands
        case 'add':
        case 'kick':
        case 'promote':
        case 'demote':
        case 'hidetag':
        case 'tagall':
        case 'welcome':
        case 'antilink':
        case 'antivirtex':
        case 'antidelete':
        case 'group':
        case 'setppgc':
        case 'setnamegc':
        case 'setdescgc':
        case 'linkgc':
        case 'resetlinkgc':
        case 'kickme':
        case 'vote':
        case 'devote':
            if (isGroup) {
                await group.groupCommands(sock, from, command, args, sender, msg);
            } else {
                await sock.sendMessage(from, { text: 'Command grup!' });
            }
            break;
        default:
            await sock.sendMessage(from, { text: 'Command tidak dikenal. Ketik .menu' });
    }
}

async function handleButton(sock, update) {
    const from = update.key.remoteJid;
    const buttonId = update.update.buttons_response_message.selected_button_id;
    const sender = update.key.participant || update.key.remoteJid.split('@')[0];

    // Handle verification
    if (buttonId === 'verify') {
        await approval.registerUser(sock, from, sender);
        return;
    }

    // Handle store buttons, etc. (expand based on button ids)
    // Example: if (buttonId.startsWith('buy_')) { store.buyProduct(...); }
    // For owner button
    if (buttonId === 'owner_chat') {
        await sock.sendMessage(from, { text: `Hubungi owner: wa.me/${config.ownerNumber}` });
        return;
    }
    if (buttonId === 'join_group') {
        await sock.sendMessage(from, { text: `Join grup: ${config.groupLink}` });
        return;
    }
    if (buttonId === 'qris_pay') {
        await payment.showQRIS(sock, from);
        return;
    }
    // Add more button handlers
}

module.exports = { handle, handleButton };
