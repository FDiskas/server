import * as alt from 'alt-client';

// alt.Player.local.model 0x9C9EFFD8 - female
// alt.Player.local.model 0x705E61F2 - male

export const animationList = {
    no: {
        dict: 'mp_player_int_upper_nod',
        name: 'mp_player_int_nod_no',
        flag: 49,
        duration: -1,
    },
    picky: {
        dict: 'mp_player_int_upperarse_pick',
        name: 'mp_player_int_arse_pick',
        flag: 49,
        duration: -1,
    },
    grab: {
        dict: 'mp_player_int_uppergrab_crotch',
        name: 'mp_player_int_grab_crotch',
        flag: 49,
        duration: -1,
    },
    peace: {
        dict: 'mp_player_int_upperpeace_sign',
        name: 'mp_player_int_peace_sign',
        flag: 49,
        duration: -1,
    },
    dead: {
        dict: 'misslamar1dead_body',
        name: 'dead_idle',
        flag: 2,
        duration: -1,
    },
    clap: {
        dict: 'anim@mp_player_intcelebrationmale@slow_clap',
        name: 'slow_clap',
        flag: 49,
        duration: -1,
    },
    lean2: {
        dict: 'amb@lo_res_idles@',
        name: 'world_human_lean_male_legs_crossed_lo_res_base',
        flag: 2,
        duration: -1,
    },
    lean: {
        dict: 'amb@lo_res_idles@',
        name: 'world_human_lean_male_foot_up_lo_res_base',
        flag: 49,
        duration: -1,
    },
    sit: {
        dict:
            alt.Player.local.model === 0x705e61f2
                ? 'amb@world_human_picnic@male@base'
                : 'amb@world_human_picnic@female@base',
        name: 'base',
        flag: 1,
        duration: -1,
    },
    bum: {
        dict: 'amb@world_human_bum_slumped@male@laying_on_left_side@base',
        name: 'base',
        flag: 2,
        duration: -1,
    },
    sitUps: {
        dict: 'amb@world_human_sit_ups@male@base',
        name: 'base',
        flag: 1,
        duration: -1,
    },
    pushUps: {
        dict: 'amb@world_human_push_ups@male@base',
        name: 'base',
        flag: 1,
        duration: -1,
    },
    yoga: {
        dict: 'amb@world_human_yoga@male@base',
        name: 'base_a',
        flag: 1,
        duration: -1,
    },
    squat: {
        dict: 'amb@lo_res_idles@',
        name: 'squat_lo_res_base',
        flag: 2,
        duration: -1,
    },
    guard: {
        dict: 'rcmepsilonism8',
        name: 'base_carrier',
        flag: 49,
        duration: -1,
    },
    taxi: {
        dict: alt.Player.local.model === 0x705e61f2 ? 'anim@amb@waving@male' : 'anim@amb@waving@female',
        name: 'ground_wave',
        flag: 49,
        duration: -1,
    },
};
