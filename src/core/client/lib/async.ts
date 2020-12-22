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

export const loadModelAsync = (model) => {
    return new Promise((resolve, reject) => {
        if (typeof model === 'string') model = native.getHashKey(model);

        if (!native.isModelValid(model)) return reject(false);

        if (native.hasModelLoaded(model)) return resolve(true);

        native.requestModel(model);

        let interval = alt.setInterval(() => {
            if (native.hasModelLoaded(model)) {
                alt.clearInterval(interval);
                return resolve(true);
            }
        }, 100);
    });
};
