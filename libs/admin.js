// Admin features, similar to owner but for admins
// Load from admins.json
async function adminCommands(sock, from, command, args, sender) {
    const admins = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'admins.json'), 'utf8'));
    if (!admins.includes(sender)) return await sock.sendMessage(from, { text: 'Bukan admin!' });

    // Implement addlimit, addsaldo, etc.
    await sock.sendMessage(from, { text: `Admin command ${command} executed.` });
}

module.exports = { adminCommands };
