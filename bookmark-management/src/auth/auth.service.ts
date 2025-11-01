import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDtoSignUp, AuthDtoSignIn } from "./dto";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CassandraService } from "src/database/database.service";

@Injectable()
export class AuthService {
    private usersClient;
    constructor(private cassandra: CassandraService, private jwt: JwtService, private config: ConfigService) {
        this.usersClient = this.cassandra.getUsersClient();
    }

    async signup(dto: AuthDtoSignUp) {
        // generate password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
        const userId = uuidv4();
        // existing user check
        const emailCheck = await this.usersClient.execute(
            `SELECT * FROM email_lookup WHERE email = ?`,
            [dto.email],
            {prepare: true}
        );
        const usernameCheck = await this.usersClient.execute(
            `SELECT * FROM username_lookup WHERE username = ?`,
            [dto.username],
            {prepare: true}
        );
        if (emailCheck.rowLength) throw new ForbiddenException("Email already in use");
        if (usernameCheck.rowLength) throw new ForbiddenException("Username already in use");
        try {     
            // save the new user in the db
            // const user = await this.prisma.user.create({
            //     data: {
            //         email: dto.email,
            //         hash: hashedPassword,
            //         firstName: dto.firstName,
            //         lastName: dto.lastName
            //     }
            // });
            this.usersClient.execute(`INSERT INTO email_lookup (email, user_id) VALUES(?, ?)`,
                [dto.email, userId],
                {prepare: true}
            );
            this.usersClient.execute(`INSERT INTO username_lookup (username, user_id) VALUES(?, ?)`,
                [dto.username, userId],
                {prepare: true}
            );
            const user = this.usersClient.execute(`
                INSERT INTO users (user_id, username, email, password)
                VALUES(?, ?, ?, ?)`,
                [userId, dto.username, dto.email, hashedPassword],
                {prepare: true}
            );
            return { message: "User registered successfully!", userId };
        } catch(error) {
            console.log("Some error in auth/signup\n" + error);
        }
    }
    
    async signin(dto: AuthDtoSignIn) {
        // find user by email
        const result = await this.usersClient.execute(
            `SELECT user_id FROM email_lookup WHERE email = ?`,
            [dto.email],
            { prepare: true }
        );
        // if user does not exist throw exception
        if(!result.rowLength) throw new ForbiddenException("User not found");
        const user_id = result.first().user_id;
        const user = await this.usersClient.execute(
            `SELECT * FROM users WHERE user_id = ?`,
            [user_id],
            {prepare: true}
        );
        const user_password = user.first().password;
        // compare password
        const isMatch = await bcrypt.compare(dto.password, user_password);
        // if password incorrect throw exception
        if (!isMatch) throw new ForbiddenException("Credentials incorrect");
        // if all ok send back user
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email: email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get("JWT_SECRET")
        });

        return {
            access_token: token
        };
    }
}