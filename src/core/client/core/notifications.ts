import * as native from 'natives';

// notificationMessage('You were slapped.', false, NotificationType.success);
// https://github.com/godkoten/altv-notifications
export const enum NotificationType {
    error = 6,
    success = 184,
    warning = 190,
    default = -1,
}
export const notificationMessage = (
    message,
    flashing = false,
    // textColor = -1,
    bgColor: NotificationType = -1,
    flashColor = [0, 0, 0, 50]
) => {
    // if (textColor > -1) {
    //     native.setColourOfNextTextComponent(textColor);
    // }
    if (bgColor > -1) {
        native.thefeedSetNextPostBackgroundColor(bgColor);
    }
    if (flashing) {
        native.thefeedSetAnimpostfxColor(flashColor[0], flashColor[1], flashColor[2], flashColor[3]);
    }

    native.beginTextCommandThefeedPost('CELL_EMAIL_BCON');
    native.addTextComponentSubstringPlayerName(message);

    // native.endTextCommandThefeedPostMessagetext(notifPic, notifPic, flashing, iconType, title, sender);

    native.endTextCommandThefeedPostTicker(flashing, true);
};
