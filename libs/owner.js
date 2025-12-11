const config = require('../config');

async function ownerInfo(sock, from) {
    const text = `👑 *Owner Bot*\n\nLiviaa Astranica\nHubungi: wa.me/${config.ownerNumber}`;
    const buttons = [
        { buttonId: 'owner_chat', buttonText: { displayText: 'Chat Owner' }, type: 1 }
    ];
    await sock.sendMessage(from, {
        text,
        footer: 'Klik button untuk chat',
        buttons,
        headerType: 1
    });
}

async function ownerCommands(sock, from, command, args) {
    // Implementasi command owner, misal broadcast
    if (command === 'broadcast') {
        const message = args.join(' ');
        // Kirim ke semua contacts, skip detail
        await sock.sendMessage(from, { text: 'Broadcast sent!' });
    }
    // Add others similarly
}

module.exports = { ownerInfo, ownerCommands };
