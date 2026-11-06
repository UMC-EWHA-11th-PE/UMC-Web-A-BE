import {QueryFailedError} from "typeorm";

export const isDuplicateKeyError = (e: unknown): boolean =>
    e instanceof QueryFailedError &&
    (e.driverError as { code?: string } | undefined)?.code === 'ER_DUP_ENTRY';
