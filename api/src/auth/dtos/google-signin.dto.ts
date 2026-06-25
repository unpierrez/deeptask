import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleSignInDTO {
    @IsString()
    @IsNotEmpty()
    credential: string;
}
