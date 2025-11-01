import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CassandraService } from "../../database/database.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt2") {
  constructor(config: ConfigService, private cassandra: CassandraService) {
    const jwt_secret = config.get("JWT_SECRET");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt_secret
    });
  }

  async validate(payload: any) {
    const usersClient = this.cassandra.getUsersClient();
    const user = await usersClient.execute(
      `SELECT * FROM user WHERE id = ?`,
      [payload.id],
      {prepare: true}
    );
    if (!user) throw new ForbiddenException("User not found");
    return user.rows;
  }
}