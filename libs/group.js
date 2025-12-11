const fs = require('fs');
const path = require('path');
const config = require('../config');
const dataPath = path.join(__dirname, '..', 'data');

async function groupCommands(sock, from, command, args, sender, msg) {
    const groupMetadata = await sock.groupMetadata(from);
    const isAdmin = groupMetadata.participants.some(p => p.id === sender && p.admin);

    if (!isAdmin && ['add', 'kick', 'promote', 'demote', 'group', 'setppgc', 'setnamegc', 'setdescgc', 'resetlinkgc'].includes(command)) {
        return await sock.sendMessage(from, { text: 'Butuh admin!' });
    }

    switch (command) {
        case 'add':
            const addTarget = args[0].replace('@', '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [addTarget], 'add');
            break;
        case 'kick':
            const kickTarget = args[0].replace('@', '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [kickTarget], 'remove');
            break;
        case 'promote':
            const promoteTarget = args[0].replace('@', '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [promoteTarget], 'promote');
            break;
        case 'demote':
            const demoteTarget = args[0].replace('@', '') + '@s.whatsapp.net';
            await sock.groupParticipantsUpdate(from, [demoteTarget], 'demote');
            break;
        case 'hidetag':
            const text = args.join(' ');
            const mentions = groupMetadata.participants.map(p => p.id);
            await sock.sendMessage(from, { text, mentions });
            break;
        case 'tagall':
            const tagText = args.join(' ') || 'Tag all!';
            const tagMentions = groupMetadata.participants.map(p => p.id);
            await sock.sendMessage(from, { text: tagText, mentions: tagMentions });
            break;
        case 'welcome':
            const settings = JSON.parse(fs.readFileSync(path.join(dataPath, 'settings.json'), 'utf8'));
            settings.welcome = args[0] === 'on';
            fs.writeFileSync(path.join(dataPath, 'settings.json'), JSON.stringify(settings, null, 2));
            await sock.sendMessage(from, { text: `Welcome ${args[0]}` });
            break;
        case 'antilink':
        case 'antivirtex':
        case 'antidelete':
            // Toggle in settings per group, store in groups.json
            let groups = JSON.parse(fs.readFileSync(path.join(dataPath, 'groups.json'), 'utf8'));
            groups[from] = groups[from] || {};
            groups[from][command] = args[0] === 'on';
            fs.writeFileSync(path.join(dataPath, 'groups.json'), JSON.stringify(groups, null, 2));
            await sock.sendMessage(from, { text: `${command} ${args[0]}` });
            break;
        case 'group':
            const action = args[0] === 'buka' ? 'unmute' : 'mute';
            await sock.groupSettingUpdate(from, action);
            break;
        case 'setppgc':
            if (msg.message.imageMessage) {
                const img = await sock.downloadAndSaveMediaMessage(msg);
                await sock.updateProfilePicture(from, { url: img });
                fs.unlinkSync(img);
            }
            break;
        case 'setnamegc':
            const name = args.join(' ');
            await sock.groupUpdateSubject(from, name);
            break;
        case 'setdescgc':
            const desc = args.join(' ');
            await sock.groupUpdateDescription(from, desc);
            break;
        case 'linkgc':
            const link = await sock.groupInviteCode(from);
            await sock.sendMessage(from, { text: `Link: https://chat.whatsapp.com/${link}` });
            break;
        case 'resetlinkgc':
            await sock.groupRevokeInvite(from);
            await sock.sendMessage(from, { text: 'Link direset.' });
            break;
        case 'kickme':
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
            break;
        case 'vote':
            // Simple vote, store in groups.json
            const voteText = args.join(' ');
            let groups = JSON.parse(fs.readFileSync(path.join(dataPath, 'groups.json'), 'utf8'));
            groups[from] = groups[from] || { votes: [] };
            groups[from].votes.push({ text: voteText, voters: [] });
            fs.writeFileSync(path.join(dataPath, 'groups.json'), JSON.stringify(groups, null, 2));
            await sock.sendMessage(from, { text: `Vote dibuat: ${voteText}` });
            break;
        case 'devote':
            // Delete last vote, etc.
            await sock.sendMessage(from, { text: 'Vote dihapus.' });
            break;
    }
}

// Welcome handler di index.js ev.on('group-participants.update')
module.exports = { groupCommands };
