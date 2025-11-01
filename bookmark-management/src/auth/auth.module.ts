import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [JwtModule.register({}), ConfigModule.forRoot({ isGlobal: true })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ConfigService]
})
export class AuthModule {}