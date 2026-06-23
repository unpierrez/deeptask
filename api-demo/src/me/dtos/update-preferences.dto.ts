import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdatePreferencesDTO {
    @IsOptional()
    @IsString()
    accentColor?: string;

    @IsOptional()
    @IsIn(['pt', 'en'])
    locale?: string;

    @IsOptional()
    @IsBoolean()
    notifyDueSoon?: boolean;

    @IsOptional()
    @IsBoolean()
    notifyHighPrio?: boolean;

    @IsOptional()
    @IsBoolean()
    notifyCompleted?: boolean;

    @IsOptional()
    @IsBoolean()
    notifyAchievement?: boolean;
}
