import * as alt from 'alt-client';
import * as native from 'natives';
import { Action } from '../enums/actions';
import { ScenarioList } from '../enums/scenarioList';

alt.on(Action.PlayerPlayOpenMap, () => {
    if (native.isPedOnFoot(alt.Player.local.scriptID)) {
        native.taskStartScenarioInPlace(
            alt.Player.local.scriptID,
            ScenarioList[ScenarioList.WORLD_HUMAN_TOURIST_MAP],
            0,
            true
        );
    }
});
