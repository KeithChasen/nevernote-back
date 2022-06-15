import { sign } from 'jsonwebtoken'
import { User } from "../entity/User";
import { CONST } from "../constants/strings";

export const generateAccessToken = (user: User) => {
    return sign({
        userId: user.id
    }, CONST.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
}

export const generateRefreshToken = (user: User) => {
    return sign({
        userId: user.id
    }, CONST.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
}