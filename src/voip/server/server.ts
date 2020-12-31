// https://altv.stuyk.com/en/cookbook/snippet_voice.html#example-usage-3d-serverside
import * as alt from 'alt-server';

interface IPlayer extends alt.Player {
    voiceRange: number;
}

class AltvVoiceServerModule {
    longRangeChannel: alt.VoiceChannel;
    midRangeChannel: alt.VoiceChannel;
    lowRangeChannel: alt.VoiceChannel;
    constructor() {
        //yell channel
        this.longRangeChannel = new alt.VoiceChannel(true, 16);
        //speak channel
        this.midRangeChannel = new alt.VoiceChannel(true, 8);
        //whisper channel
        this.lowRangeChannel = new alt.VoiceChannel(true, 3);
        this.registerEvents();
        alt.log('AltvVoiceServerModule init');
    }

    registerEvents() {
        //alternatively call it after player successfully spawned after authentication
        alt.on('playerConnect', (player: IPlayer) => {
            this.addToVoiceChannels(player);
            this.changeVoiceRange(player);
        });
        //handle player disconnect
        alt.on('playerDisconnect', this.removePlayerFromChannels.bind(this));
        //handle player gamecrash/entity invalidity
        alt.on('removeEntity', this.removePlayerFromChannels.bind(this));
        //handle player voice range change
        alt.onClient('server:ChangeVoiceRange', this.changeVoiceRange.bind(this));
    }

    /**
     * clear channels for given player
     * @param  {alt.Player} player
     * @returns {void}
     */
    removePlayerFromChannels(player: IPlayer): void {
        if (this.lowRangeChannel.isPlayerInChannel(player)) {
            this.lowRangeChannel.removePlayer(player);
        }
        if (this.midRangeChannel.isPlayerInChannel(player)) {
            this.midRangeChannel.removePlayer(player);
        }
        if (this.longRangeChannel.isPlayerInChannel(player)) {
            this.longRangeChannel.removePlayer(player);
        }
    }

    /**
     * add player to all voice channels
     * @param  {alt.Player} player
     * @returns {void}
     */
    addToVoiceChannels(player: IPlayer): void {
        this.lowRangeChannel.addPlayer(player);
        this.midRangeChannel.addPlayer(player);
        this.longRangeChannel.addPlayer(player);
    }

    /**
     * mute player in all voice channels
     * @param  {alt.Player} player
     * @returns {void}
     */
    muteInAllChannels(player: IPlayer): void {
        this.lowRangeChannel.mutePlayer(player);
        this.midRangeChannel.mutePlayer(player);
        this.longRangeChannel.mutePlayer(player);
    }

    /**
     * takes a range for a player and mutes this player in all channels he shouldn´t be heard
     * @param  {alt.Player} player
     * @param  {number} range
     * @returns {void}
     */
    muteNotInRangeChannels(player: IPlayer, range: number): void {
        switch (range) {
            case 3:
                this.midRangeChannel.mutePlayer(player);
                this.longRangeChannel.mutePlayer(player);
                break;
            case 8:
                this.lowRangeChannel.mutePlayer(player);
                this.longRangeChannel.mutePlayer(player);
                break;
            case 15:
                this.lowRangeChannel.mutePlayer(player);
                this.midRangeChannel.mutePlayer(player);
                break;
            default:
                break;
        }
    }

    /**
     * change the voice range of the given player and unmute in new range channel
     * @param  {alt.Player} player
     * @returns {void}
     */
    changeVoiceRange(player: IPlayer): void {
        if (!player.voiceRange) {
            player.voiceRange = 0;
        }
        switch (player.voiceRange) {
            case 0:
                player.voiceRange = 3;
                this.muteNotInRangeChannels(player, 3);
                this.lowRangeChannel.unmutePlayer(player);
                alt.emitClient(player, 'client:UpdateCurrentAltVoiceRange', 3);
                break;
            case 3:
                player.voiceRange = 8;
                this.muteNotInRangeChannels(player, 8);
                this.midRangeChannel.unmutePlayer(player);
                alt.emitClient(player, 'client:UpdateCurrentAltVoiceRange', 8);
                break;
            case 8:
                player.voiceRange = 15;
                this.muteNotInRangeChannels(player, 15);
                this.longRangeChannel.unmutePlayer(player);
                alt.emitClient(player, 'client:UpdateCurrentAltVoiceRange', 15);
                break;
            case 15:
                player.voiceRange = 0;
                this.muteInAllChannels(player);
                alt.emitClient(player, 'client:UpdateCurrentAltVoiceRange', 0);
                break;
            default:
                break;
        }
    }
}

// initialize voice class instance
export const AltvVoiceServerModuleInstance = new AltvVoiceServerModule();
