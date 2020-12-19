import * as alt from 'alt-client';

import native from 'natives';

let pos = alt.Player.local.pos;
let gameObject = native.createObject(
    native.getHashKey('gr_prop_gr_trailer_tv'),
    pos.x,
    pos.y,
    pos.z,
    false,
    false,
    true
);
let view = null;
alt.log(
    'exist = ' + alt.isTextureExistInArchetype(native.getHashKey('gr_prop_gr_trailer_tv'), 'script_rt_gr_trailertv_01')
);
let inter = alt.setInterval(() => {
    if (alt.isTextureExistInArchetype(native.getHashKey('gr_prop_gr_trailer_tv'), 'script_rt_gr_trailertv_01')) {
        view = new alt.WebView(
            'https://www.youtube.com',
            native.getHashKey('gr_prop_gr_trailer_tv'),
            'script_rt_gr_trailertv_01'
        );
        alt.clearInterval(inter);
        return;
    }
}, 50);

alt.on('keydown', (key) => {
    /* 0x72 F3 */
    if (key == 0x79 && view) {
        view.destroy();
        native.deleteObject(gameObject);
        view = null;
    }
});
