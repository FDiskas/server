// https://altv.stuyk.com/en/cookbook/snippet_voice.html#example-usage-3d-clientside
import * as alt from 'alt-client';

class AltvVoiceClientModule {
    localPlayer: alt.Player;
    interval: number;
    talkingState: boolean;
    currentRange: number;
    constructor() {
        //localPlayer object shortcut
        this.localPlayer = alt.Player.local;
        //interval to check state changes
        this.interval = null;
        //cached talking state
        this.talkingState = false;
        //cached voice range
        this.currentRange = 0;
        this.registerEvents();
        alt.log('AltvVoiceClientModule init');
    }

    registerEvents() {
        alt.on('keydown', (key) => {
            if (key == 107) {
                //Press Num+ to change the range in which you get heard by other players
                alt.emitServer('server:ChangeVoiceRange');
            }
        });

        alt.onServer('client:UpdateCurrentAltVoiceRange', (range) => {
            this.currentRange = range;
            //emit new range to your user interface
            /* example payload
                {
                muted: range === 0 ? true : false,
                range: range
                }
            */
        });

        this.registerTalkingInterval();
    }

    /*
     * interval to handle talking state changes
     * i.e show in your ui if this player is talking (like ts3 voice led)
     */
    registerTalkingInterval() {
        this.interval = alt.setInterval(() => {
            //only emit if state changed
            if (this.talkingState !== this.localPlayer.isTalking && this.currentRange !== 0) {
                this.talkingState = this.localPlayer.isTalking;
                //emit talking state change to your ui {this.talkingState}
                alt.emit('talking', true);
            }
            if (this.talkingState && this.currentRange === 0) {
                //emit talking state change to your ui {false}
                alt.emit('talking', false);
            }
        }, 444);
    }
}

//initialize voice class instance
export const AltvVoiceClientModuleInstance = new AltvVoiceClientModule();
