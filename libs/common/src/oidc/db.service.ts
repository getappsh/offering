import { Injectable, Logger } from "@nestjs/common";
import { OidcService } from "./oidc.interface";
import { UserDto } from "../dto/oidc/dto/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MemberEntity } from "../database/entities";
import { Repository } from "typeorm";

@Injectable()
export class DBService implements OidcService {

  private readonly logger = new Logger(DBService.name);

  constructor(
    @InjectRepository(MemberEntity) private readonly memberRepo: Repository<MemberEntity>
  ) { }

  async inviteUser(params?: UserDto): Promise<void> {

  }

  async authenticate(): Promise<void> {
  }

  async getUsers(params?: Partial<{ [key in keyof UserDto]: any }>): Promise<UserDto[]> {
    this.logger.log('get all users from db');

    const getEKey = (key: keyof UserDto): keyof MemberEntity => {
      switch (key) {
        case "email":
          return "email";
        case "firstName":
          return "firstName";
        case "lastName":
          return "lastName";
        default:
          return undefined;
      }
    }

    const query: Partial<MemberEntity> = {}

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        query[getEKey(key as keyof UserDto) as string] = value;
      })
      const queryBuilder = this.memberRepo.createQueryBuilder('member');
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          const eKey = getEKey(key as keyof UserDto);
          if (eKey) {
            queryBuilder.andWhere(`member.${eKey} ILIKE :${eKey}`, { [eKey]: `%${value}%` });
          }
        });
      }
      const resUsers = (await queryBuilder.getMany()).map(UserDto.fromMemberE);
      return resUsers;
    }

    const resUsers = (await this.memberRepo.find()).map(UserDto.fromMemberE);
    return resUsers;
  }
}