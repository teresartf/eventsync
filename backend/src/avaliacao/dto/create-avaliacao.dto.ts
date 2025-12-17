import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateAvaliacaoDto {
  @IsString()
  eventId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  comment?: string;
}