export type HyperdriveBinding = {
    connectionString: string;
};

export type Bindings = {
    JWT_SECRET: string;
    HYPERDRIVE?: HyperdriveBinding;
    DATABASE_URL?: string;
};

export type Variables = {
    userId: string;
};