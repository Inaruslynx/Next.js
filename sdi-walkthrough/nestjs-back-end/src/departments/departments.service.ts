import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Department } from 'src/schemas/departments.schema';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name) private departmentModel: Model<Department>,
  ) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return 'This action adds a new department';
  }

  async findAll() {
    const departments = await this.departmentModel
      .find()
      .select('name walkthroughs')
      .populate('walkthroughs', 'name')
      .exec();
    return departments;
  }

  findOne(id: string) {
    return `This action returns a #${id} department`;
  }

  update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: string) {
    return `This action removes a #${id} department`;
  }
}
