export const UserContract = {
    CDI: "blue badge",
    CDD: "green badge",
} as const;

export type UserContract = (typeof UserContract)[keyof typeof UserContract];

export const UserTeam = {
    O1: "O1",
    O2: "O2",
    O3: "O3",
    I1: "I1",
    I2: "I2",
    I3: "I3",
    VS: "VS",
    SD: "SD",
    APM: "APM",
} as const;

export type UserTeam = (typeof UserTeam)[keyof typeof UserTeam];
