import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Area, AreaDocument } from 'src/schemas/areas.schema';
import { Walkthrough } from 'src/schemas/walkthroughs.schema';
import { DataPoint } from 'src/schemas/DataPoints.schema';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name) private areaModel: Model<Area>,
    @InjectModel(Walkthrough.name) private walkthroughModel: Model<Walkthrough>,
    @InjectModel(DataPoint.name) private dataPointModel: Model<DataPoint>,
  ) {}
  async create(createAreaDto: CreateAreaDto) {
    // console.log('Create New Area:', createAreaDto);
    // Check for missing data
    if (!createAreaDto.name) {
      throw new BadRequestException('Missing name.');
    }
    if (!createAreaDto.parentType) {
      throw new BadRequestException('Missing parent type.');
    }
    if (!createAreaDto.parentWalkthrough) {
      throw new BadRequestException('Bad Request. Missing parent walkthrough.');
    }

    const walkthroughDoc = await this.walkthroughModel.findById(
      createAreaDto.parentWalkthrough,
    );
    // Error if Walkthrough not found
    if (walkthroughDoc.errors) {
      throw new NotFoundException('Walkthrough not found', {
        cause: new Error(),
        description: 'Walkthrough not found',
      });
    }

    // If parent is a walkthrough
    if (createAreaDto.parentType === 'walkthrough') {
      const areaDoc = new this.areaModel({
        name: createAreaDto.name,
        parentType: 'walkthrough',
        parentWalkthrough: walkthroughDoc,
        dataPoints: [],
        areas: [],
      });
      const result = await areaDoc.save();
      // Check if save was unsuccessful
      if (result.errors) {
        throw new InternalServerErrorException(
          'Failed to create area: ' + result.errors,
        );
      }
      walkthroughDoc.data.push(result);
      await walkthroughDoc.save();
      return areaDoc;
    }

    // If parent is an area
    if (createAreaDto.parentType === 'area') {
      const parentAreaDoc = await this.areaModel.findById(
        createAreaDto.parentArea,
      );
      // Error if Area not found
      if (parentAreaDoc.errors) {
        throw new NotFoundException('Area not found', {
          cause: new Error(),
          description: 'Area not found',
        });
      }
      const areaDoc = new this.areaModel({
        name: createAreaDto.name,
        parentType: 'area',
        parentWalkthrough: walkthroughDoc,
        parentArea: parentAreaDoc,
        dataPoints: [],
        areas: [],
      });
      const result = await areaDoc.save();
      // Check if save was unsuccessful
      if (result.errors) {
        throw new InternalServerErrorException(
          'Failed to create area: ' + result.errors,
        );
      }
      console.log('error?');
      parentAreaDoc.areas.push(result);
      await parentAreaDoc.save();
      return areaDoc;
    }
    throw new InternalServerErrorException('Failed to create area');
  }

  async findAll(walkthrough: string) {
    if (!walkthrough) {
      throw new BadRequestException('Missing walkthrough');
    }
    const areaDoc = await this.areaModel.find({
      parentWalkthrough: walkthrough,
    });
    if (!areaDoc || areaDoc.length === 0) {
      throw new InternalServerErrorException('Failed to find area');
    }
    return areaDoc;
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Missing id');
    }
    const areaDoc = await this.areaModel
      .findById(id)
      .populate('areas dataPoints');
    if (areaDoc.errors || !areaDoc._id) {
      throw new InternalServerErrorException('Failed to find area');
    }
    return areaDoc;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto) {
    if (!id) {
      throw new BadRequestException('Missing id');
    }
    const areaDoc = await this.areaModel.findById(id);
    if (areaDoc.errors) {
      throw new InternalServerErrorException('Failed to find area');
    }
    areaDoc.name = updateAreaDto.name;
    const result = await areaDoc.save();
    if (result.errors) {
      throw new InternalServerErrorException(
        'Failed to update area: ' + result.errors,
      );
    }
    return result;
  }

  async remove(id: string) {
    // if no id provided then error
    if (!id) {
      throw new BadRequestException('Missing id');
    }
    // find the area to be deleted
    const targetAreaDoc = await this.areaModel.findById(id);
    // check if there were errors finding the areaDoc
    if (targetAreaDoc.errors) {
      throw new InternalServerErrorException(`Failed to find area: ${id}`);
    }
    // The parent of the area is either the walkthrough or another area
    if (targetAreaDoc.parentType === 'walkthrough') {
      const walkthroughDoc = await this.walkthroughModel
        .findById(targetAreaDoc.parentWalkthrough)
        .populate('data');
      if (walkthroughDoc.errors) {
        throw new InternalServerErrorException(
          `Failed to find walkthrough: ${targetAreaDoc.parentWalkthrough}`,
        );
      }
      // console.log('walkthroughDoc:', walkthroughDoc.data);
      // console.log('targetAreaDoc:', targetAreaDoc._id);
      walkthroughDoc.data = walkthroughDoc.data.filter(
        (area: AreaDocument) =>
          area._id.toString() != targetAreaDoc._id.toString(),
      );
      // console.log('walkthroughDoc:', walkthroughDoc.data);
      const result = await this.areaModel.findByIdAndDelete(id);
      if (result.errors) {
        throw new InternalServerErrorException(`Failed to delete ${id}`);
      }
      const walkthroughSave = await walkthroughDoc.save();
      if (walkthroughSave.errors) {
        console.log(walkthroughSave);
      }
      return result;
      // If parent isn't a walkthrough is it an area?
    } else if (targetAreaDoc.parentType === 'area') {
      const parentAreaDoc = await this.areaModel
        .findById(targetAreaDoc.parentArea)
        .populate('areas');
      if (parentAreaDoc.errors) {
        throw new InternalServerErrorException(
          `Failed to find parent area: ${targetAreaDoc.parentArea}`,
        );
      }
      // filter the target area from the list of areas in target
      parentAreaDoc.areas = parentAreaDoc.areas.filter(
        (area: AreaDocument) =>
          area._id.toString() !== targetAreaDoc._id.toString(),
      );
      const result = await this.areaModel.findByIdAndDelete(id);
      if (result.errors) {
        throw new InternalServerErrorException(`Failed to delete ${id}`);
      }
      await parentAreaDoc.save();
      // return the results of deleting area
      return result;
    }
    throw new InternalServerErrorException(
      `Parent type was neither area or walkthrough`,
    );
  }
}
