// src/modules/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { UpsertUserDto } from './upsert-user.dto';

export class UpdateUserDto extends PartialType(UpsertUserDto) {}