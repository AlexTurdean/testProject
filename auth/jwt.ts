import { encode, decode, TAlgorithm } from "jwt-simple";

export interface Session {
    id: number;
    name: string;
    issued: number;
    expires: number;
}

export type PartialSession = Omit<Session, "issued" | "expires">;

export interface EncodeResult {
    token: string;
    expires: number;
    issued: number;
}

export type DecodeResult =
      {
          type: "valid";
          session: Session;
      }
    | {
          type: "integrity-error";
      }
    | {
          type: "invalid-token";
      };

export type ExpirationStatus = "expired" | "active" | "grace";

export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
    const algorithm: TAlgorithm = "HS512";
    const issued = Date.now();
    const fifteenMinutesInMs = 15 * 60 * 1000;
    const expires = issued + fifteenMinutesInMs;
    const session: Session = {
        ...partialSession,
        issued: issued,
        expires: expires
    };

    return {
        token: encode(session, secretKey, algorithm),
        issued: issued,
        expires: expires
    };
}

export function decodeSession(secretKey: string, tokenString: string): DecodeResult {
    const algorithm: TAlgorithm = "HS512";
    let result: Session;

    try {
        result = decode(tokenString, secretKey, false, algorithm);
    } catch (_e) {
        const e: Error = _e;

        if (e.message === "No token supplied" || e.message === "Not enough or too many segments") {
            return {
                type: "invalid-token"
            };
        }

        if (e.message === "Signature verification failed" || e.message === "Algorithm not supported") {
            return {
                type: "integrity-error"
            };
        }

        if (e.message.indexOf("Unexpected token") === 0) {
            return {
                type: "invalid-token"
            };
        }

        throw e;
    }

    return {
        type: "valid",
        session: result
    }
}

export function checkExpiration(token: Session): ExpirationStatus {
    const now = Date.now();
    if (token.expires > now) return "active";

    const threeHoursInMs = 3 * 60 * 60 * 1000;
    const threeHoursAfterExpiration = token.expires + threeHoursInMs;
    if (threeHoursAfterExpiration > now) return "grace";

    return "expired";
}
