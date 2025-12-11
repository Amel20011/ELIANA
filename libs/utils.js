// Utils seperti runtime, ping, profile, downloader stub
async function infoCommand(sock, from, command) {
    let text;
    switch (command) {
        case 'runtime':
            const uptime = process.uptime();
            text = `Uptime: ${Math.floor(uptime / 3600)} jam`;
            break;
        case 'ping':
            text = 'Pong!';
            break;
        case 'profile':
            text = 'Profile info...';
            break;
        case 'limit':
        case 'saldo':
            text = 'Limit/Saldo: 0'; // Load from db
            break;
        default:
            return;
    }
    await sock.sendMessage(from, { text });
}

async function downloader(sock, from, command, url) {
    // Stub, install ytdl-core dll untuk real
    await sock.sendMessage(from, { text: `Download ${command} from ${url} - Coming soon!` });
}

module.exports = { infoCommand, downloader };
