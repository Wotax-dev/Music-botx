const { EmbedBuilder } = require('discord.js');
const emojis = require('../emojis.js');
const config = require('../config.js');

function formatDuration(ms) {
    if (!ms || ms <= 0 || ms === 'Infinity') return 'LIVE';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
    }
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function getDurationString(track) {
    if (!track || !track.info) return '00:00';
    if (track.info.isStream) return 'LIVE';
    const duration = track.info.duration || track.info.length || 0;
    if (duration <= 0) return 'LIVE';
    return formatDuration(duration);
}

module.exports = {
    success: (channel, message) => {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF') // cyan
            .setTitle('Music Bot by WOTAX')
            .setDescription(`🎵 ${message}`)
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();
        return channel.send({ embeds: [embed] });
    },

    error: (channel, message) => {
        const embed = new EmbedBuilder()
            .setColor('#FF073A') // neon red
            .setTitle('Music Bot by WOTAX')
            .setDescription(`⚠️ ${message}`)
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();
        return channel.send({ embeds: [embed] });
    },

    nowPlaying: (channel, track) => {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Music Bot by WOTAX')
            .setDescription(`${emojis.music} Now Playing :- 🎶 **${track.info.title}**`)
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();

        if (track.info.thumbnail) embed.setThumbnail(track.info.thumbnail);

        embed.addFields(
            { name: '🎤 Artist', value: `${track.info.author}`, inline: false },
            { name: '⏱ Duration', value: `${getDurationString(track)}`, inline: false },
            { name: '🙋 Requested By', value: `${track.info.requester.tag}`, inline: false }
        );

        return channel.send({ embeds: [embed] });
    },

    addedToQueue: (channel, track, position) => {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Music Bot by WOTAX')
            .setDescription(`${emojis.success} Added to queue: 🎵 **${track.info.title}**`)
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();

        if (track.info.thumbnail) embed.setThumbnail(track.info.thumbnail);

        embed.addFields(
            { name: '🎤 Artist', value: `${track.info.author}`, inline: false },
            { name: '⏱ Duration', value: `${getDurationString(track)}`, inline: false }
        );

        return channel.send({ embeds: [embed] });
    },

    addedPlaylist: (channel, playlistInfo, tracks) => {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Music Bot by WOTAX')
            .setDescription(`📀 Playlist Added: **${playlistInfo.name}**`)
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();

        if (playlistInfo.thumbnail) embed.setThumbnail(playlistInfo.thumbnail);

        const totalDuration = tracks.reduce((acc, t) => (!t.info.isStream && (t.info.duration || t.info.length)) ? acc + (t.info.duration || t.info.length) : acc, 0);
        embed.addFields(
            { name: '⏱ Total Duration', value: formatDuration(totalDuration), inline: false },
            { name: '🔢 Stream Count', value: `${tracks.filter(t => t.info.isStream).length}`, inline: false }
        );

        return channel.send({ embeds: [embed] });
    },

    queueEnded: (channel) => {
        const embed = new EmbedBuilder()
            .setColor('#FF073A') // neon red
            .setTitle('Music Bot by WOTAX')
            .setDescription(`${emojis.info} Queue has ended. Leaving voice channel.`)
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();

        return channel.send({ embeds: [embed] });
    },

    queueList: (channel, queue, currentTrack, currentPage = 1, totalPages = 1) => {
        const embed = new EmbedBuilder()
            .setColor('#FF073A')
            .setTitle('Music Bot by WOTAX')
            .setDescription(currentTrack ? `**Now Playing:**\n🎵 [${currentTrack.info.title}](${currentTrack.info.uri})\n⏱ ${getDurationString(currentTrack)}\n\n**Up Next:**` : '**Queue:**')
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();

        if (currentTrack && currentTrack.info.thumbnail) embed.setThumbnail(currentTrack.info.thumbnail);

        if (queue.length) {
            const tracksList = queue.map((track, i) =>
                `\`${(i + 1).toString().padStart(2,'0')}\` ${emojis.song} [${track.info.title}](${track.info.uri})\n⏱ ${getDurationString(track)}`
            ).join('\n\n');
            embed.addFields({ name: '\u200b', value: tracksList });
        } else {
            embed.addFields({ name: '\u200b', value: 'No tracks in queue' });
        }

        return channel.send({ embeds: [embed] });
    },

    playerStatus: (channel, player) => {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Music Bot by WOTAX')
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp()
            .addFields(
                { name: 'Status', value: player.playing ? `${emojis.play} Playing` : `${emojis.pause} Paused`, inline: false },
                { name: 'Volume', value: `${emojis.volume} ${player.volume}%`, inline: false },
                { name: 'Loop Mode', value: `${emojis.repeat} ${player.loop === "queue" ? 'Queue' : 'Disabled'}`, inline: false }
            );

        if (player.queue.current) {
            const track = player.queue.current;
            embed.setDescription(`**Currently Playing:**\n🎵 [${track.info.title}](${track.info.uri})\n⏱ Duration: ${getDurationString(track)}`);
            if (track.info.thumbnail) embed.setThumbnail(track.info.thumbnail);
        }

        return channel.send({ embeds: [embed] });
    },

    help: (channel, commands) => {
        const embed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Music Bot by WOTAX')
            .setDescription(commands.map(cmd => `🎵 \`${cmd.name}\` - ${cmd.description}`).join('\n\n'))
            .setImage('https://i.imgur.com/xzUP5cS.gif')
            .setFooter({ text: 'DEVELOPED BY WOTAX' })
            .setTimestamp();
        return channel.send({ embeds: [embed] });
    }
};
