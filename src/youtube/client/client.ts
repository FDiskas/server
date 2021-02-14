import * as alt from 'alt-client';

import native from 'natives';

let view = null;
let view2 = null;
let gameObject = null;
alt.on('youtube', () => {
    // let pos = alt.Player.local.pos;
    // gameObject = native.createObject(
    //     native.getHashKey('gr_prop_gr_trailer_tv'),
    //     pos.x,
    //     pos.y,
    //     pos.z,
    //     false,
    //     false,
    //     true
    // );
    // Texture ap1_03_rssd_rt_billboard_2x1_0001
    // Object ap1_03_bbrds01
    alt.log(
        'exist = ' +
            alt.isTextureExistInArchetype(native.getHashKey('gr_prop_gr_trailer_tv'), 'script_rt_gr_trailertv_01')
    );
    // let inter = alt.setInterval(() => {
    // if (alt.isTextureExistInArchetype(native.getHashKey('gr_prop_gr_trailer_tv'), 'script_rt_gr_trailertv_01')) {
    // if (alt.isTextureExistInArchetype(native.getHashKey('ap1_03_bbrds01'), 'ap1_03_rssd_rt_billboard_2x1_0001')) {
    // new alt.WebView(url: string);
    // new alt.WebView(url: string, overlay: boolean);
    // new alt.Webview(url: string, pos: IVector2);
    // new alt.WebView(url: string, drawable: number, texture: string);
    // new alt.Webview(url: string, pos: IVector2, size: IVector2);
    // new alt.Webview(url: string, overlay: boolean, pos: IVector2, size: IVector2);

    view = new alt.WebView(
        'http://resource/client/html/index.html',
        // native.getHashKey('gr_prop_gr_trailer_tv'),
        alt.hash('ap1_03_bbrds01'),
        // 'script_rt_gr_trailertv_01'
        'ap1_03_rssd_rt_billboard_2x1_0001'
    );
    view2 = new alt.WebView(
        'https://www.youtube.com/embed/AkPqMRCOxv8?autoplay=1&mute=1&loop=1&controls=0&rel=0&iv_load_policy=3&modestbranding=1',
        // native.getHashKey('gr_prop_gr_trailer_tv'),
        alt.hash('ap1_03_bbrds01b'),
        // 'script_rt_gr_trailertv_01'
        'ap1_03chains_of_intimacy_3x1'
    );

    view.unfocus();
    view2.unfocus();

    // alt.clearInterval(inter);
    return;
    // }
    // }, 50);
});

alt.on('keydown', (key) => {
    if (alt.isMenuOpen() || native.isPauseMenuActive()) return;
    /* 0x72 F3 */
    if (key == 0x72) {
        if (view || view2) {
            view.destroy();
            view2.destroy();
            native.deleteObject(gameObject);
            view = null;
            view2 = null;
        } else {
            alt.emit('youtube');
        }
    }
});
