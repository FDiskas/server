import * as alt from 'alt-client';
import * as native from 'natives';
import { Key } from '../enums/keys';
import { distance } from '../lib/distance';

const windowList = [
    'window_lf',
    'window_rf',
    'window_lr',
    'window_rr',
    'window_lm',
    'window_rm',
    'window_lf1',
    'window_lf2',
    'window_lf3',
    'window_rf1',
    'window_rf2',
    'window_rf3',
    'window_lr1',
    'window_lr2',
    'window_lr3',
    'window_rr1',
    'window_rr2',
    'window_rr3',
];

alt.on('keydown', (key) => {
    let windowIsDown = false;
    if (key === Key.E) {
        if (alt.Player.local.vehicle) {
            let availableWindows = windowList.filter(
                (windowName) => native.getEntityBoneIndexByName(alt.Player.local.vehicle.scriptID, windowName) !== -1
            );

            const data = { window: -1, distance: 0 };
            for (const windowIndex in availableWindows) {
                const windowBone = native.getEntityBoneIndexByName(
                    alt.Player.local.vehicle.scriptID,
                    availableWindows[windowIndex]
                );
                const windowPos = native.getWorldPositionOfEntityBone(alt.Player.local.vehicle.scriptID, windowBone);
                const windowDist = distance(alt.Player.local.pos, { ...windowPos });
                alt.log(JSON.stringify({ window: availableWindows[windowIndex], windowBone, windowPos, windowDist }));

                if (windowDist < data.distance || data.distance == 0) {
                    data.window = parseInt(windowIndex);
                    data.distance = windowDist;
                }
            }

            alt.setTimeout(() => {
                if (!windowIsDown) {
                    native.rollDownWindow(alt.Player.local.vehicle.scriptID, data.window);
                    windowIsDown = true;
                }
            }, 100);

            alt.on('keyup', (key) => {
                if (key === Key.E && windowIsDown) {
                    windowIsDown = false;
                    native.rollUpWindow(alt.Player.local.vehicle.scriptID, data.window);
                }
            });
        }
    }
});
