import { Injectable } from '@nestjs/common';
import { user_role } from '@Database/Table/Admin/user_role';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { UserRoleModel } from '@Model/Admin/UserRole.model';
import { Not } from 'typeorm';

@Injectable()
export class UserRoleService {
  constructor() {
  }

  async GetAll() {
    const UserRoleList = await user_role.find({ where: { created_by_id: Not('0') } });
    return UserRoleList;
  }


  async GetById(UserRoleId: string) {
    const UserRoleData = await user_role.findOne({ where: { id: UserRoleId } });
    return UserRoleData;
  }

  async Insert(UserRoleData: UserRoleModel, UserId: string) {
    const _UserRoleData = new user_role();
    _UserRoleData.name = UserRoleData.name;
    _UserRoleData.code = UserRoleData.code;
    _UserRoleData.created_by_id = UserId;
    _UserRoleData.created_on = new Date();
    await user_role.insert(_UserRoleData);
    return _UserRoleData;
  }

  async Update(Id: string, UserRoleData: UserRoleModel, UserId: string) {
    const UserRoleUpdateData = await user_role.findOne({ where: { id: Id } });
    if (!UserRoleUpdateData) {
      throw new Error('Record not found')
    }
    UserRoleUpdateData.name = UserRoleData.name;
    UserRoleUpdateData.code = UserRoleData.code;
    UserRoleUpdateData.updated_by_id = UserId;
    UserRoleUpdateData.updated_on = new Date();
    await user_role.update(Id, UserRoleUpdateData);
    return UserRoleUpdateData;
  }

  async Delete(Id: string) {
    const UserRoleData = await user_role.findOne({ where: { id: Id } });
    if (!UserRoleData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await UserRoleData.remove();
    return true;
  }

}
