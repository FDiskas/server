import * as alt from 'alt-client';
import native from 'natives';

export const AsyncWait = (timeout: number) => {
    return new Promise((resolve: any) => {
        alt.setTimeout(resolve, timeout);
    });
};

export const WaitUntil = (cb: (...args) => boolean, ...args) => {
    return new Promise((resolve: any, _) => {
        const et = alt.everyTick(() => {
            if (!cb(...args)) return;
            alt.clearEveryTick(et);
            resolve();
        });
    });
};

export const loadModelAsync = (model: string | number) => {
    const maxCountLoadTry = 255;
    return new Promise((resolve, reject) => {
        let modelNum: number;
        if (typeof model === 'string') {
            modelNum = native.getHashKey(model);
        } else {
            modelNum = model;
        }

        if (!native.isModelValid(modelNum)) return reject(false);

        if (native.hasModelLoaded(modelNum)) return resolve(true);

        native.requestModel(modelNum);

        let count = 0;
        let interval = alt.setInterval(() => {
            if (count > maxCountLoadTry) {
                reject(false);
                alt.clearInterval(interval);
                return;
            }

            if (native.hasModelLoaded(modelNum)) {
                alt.clearInterval(interval);
                return resolve(true);
            }

            count += 1;
        }, 5);
    });
};

export async function loadAnim(dict) {
    const maxCountLoadTry = 255;
    return new Promise((resolve, reject) => {
        native.requestAnimDict(dict);

        let count = 0;
        let interval = alt.setInterval(() => {
            if (count > maxCountLoadTry) {
                reject(false);
                alt.clearInterval(interval);
                return;
            }

            if (native.hasAnimDictLoaded(dict)) {
                resolve(true);
                alt.clearInterval(interval);
                return;
            }

            count += 1;
        }, 5);
    });
}
