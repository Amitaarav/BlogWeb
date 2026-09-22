export type HyperdriveBinding = {
    connectionString: string;
};

export type Bindings = {
    JWT_SECRET: string;
    HYPERDRIVE: HyperdriveBinding;
};

export type Variables = {
    userId: string;
};