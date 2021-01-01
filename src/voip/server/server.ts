// https://altv.stuyk.com/en/cookbook/snippet_voice.html#example-usage-3d-serverside
import * as alt from 'alt-server';

interface IPlayer extends alt.Player {
    voiceRange: number;
}

class AltvVoiceServerModule {
    longRangeChannel: alt.VoiceChannel;
    constructor() {
        //yell channel
        this.longRangeChannel = new alt.VoiceChannel(true, 30);
        this.registerEvents();
        alt.log('AltvVoiceServerModule init');
    }

    registerEvents() {
        //alternatively call it after player successfully spawned after authentication
        alt.on('playerConnect', (player: IPlayer) => {
            this.addToVoiceChannels(player);
        });
        //handle player disconnect
        alt.on('playerDisconnect', this.removePlayerFromChannels.bind(this));
        //handle player gamecrash/entity invalidity
        alt.on('removeEntity', this.removePlayerFromChannels.bind(this));
    }

    /**
     * clear channels for given player
     * @param  {alt.Player} player
     * @returns {void}
     */
    removePlayerFromChannels(player: IPlayer): void {
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
        this.longRangeChannel.addPlayer(player);
    }
}

// initialize voice class instance
export const AltvVoiceServerModuleInstance = new AltvVoiceServerModule();
