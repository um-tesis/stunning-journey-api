/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/utils/errors';
import { PaginationArgs } from 'src/utils/types/pagination-args';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { PrismaService } from 'nestjs-prisma';
import axios from 'axios';
import querystring from 'querystring';
import config from '../../api/config';
import { getCorrespondingBadge } from 'src/helpers/badgr.helper';

const { BADGR_USERNAME, BADGR_PASSWORD, BADGR_ISSUER_ID, BADGR_API_URL } = config;
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  public async create(createProjectInput: CreateProjectInput) {
    return this.prisma.project.create({
      data: createProjectInput,
    });
  }

  public async findAll(args: PaginationArgs = { page: 1, itemsPerPage: 5, filter: '' }) {
    const projects = await this.prisma.project.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        name: {
          contains: args.filter,
        },
      },
    });

    const total = await this.prisma.project.count({
      where: {
        name: {
          contains: args.filter,
        },
      },
    });

    return { projects, total };
  }

  public async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        organization: true,
      },
    });
  }

  public async update(id: number, updateProjectInput: UpdateProjectInput) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) throw new NotFoundError('Project does not exist in the system');

    return this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectInput,
    });
  }

  public async remove(id: number) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }

  public async findOrganizationProjects(
    organizationId: number,
    args: PaginationArgs = { page: 1, itemsPerPage: 5, filter: '' },
  ) {
    const projects = await this.prisma.project.findMany({
      skip: (args.page - 1) * args.itemsPerPage,
      take: args.itemsPerPage,
      where: {
        organizationId,
      },
    });

    const total = await this.prisma.project.count({
      where: {
        organizationId,
      },
    });

    return { projects, total };
  }

  public async findProjectUsers(projectId: number) {
    const users = (
      await this.prisma.projectUser.findMany({
        where: {
          projectId,
        },
        select: {
          projectId: false,
          user: true,
        },
      })
    ).map((projectUser) => projectUser.user);

    const project = await this.prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!users || users.length === 0) throw new NotFoundError('Users not found for this project');

    return { users, project };
  }

  public async assignUserToProject(projectId: number, userId: number) {
    return this.prisma.projectUser.create({
      data: {
        projectId,
        userId,
      },
    });
  }

  public async loadProjectHours(projectId: number, userId: number, hours: number) {
    const projectUserRecord = await this.prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      select: {
        projectId: true,
        userId: true,
      },
    });
    if (!projectUserRecord) throw new NotFoundError('User is not assigned to this project');

    const previousTotalHours = (
      await this.prisma.projectUser.aggregate({
        _sum: {
          hours: true,
        },
        where: {
          userId,
        },
      })
    )._sum.hours;

    const newProjectUserRecord = await this.prisma.projectUser.update({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
      data: {
        hours: {
          increment: hours,
        },
      },
      include: {
        user: true,
      },
    });

    const totalHours = (
      await this.prisma.projectUser.aggregate({
        _sum: {
          hours: true,
        },
        where: {
          userId,
        },
      })
    )._sum.hours;

    const newBadge = getCorrespondingBadge(totalHours, previousTotalHours);

    if (newBadge) await this.awardNewBadge(newProjectUserRecord.user.email, newBadge);

    return this.prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  public async awardNewBadge(email: string, newBadge: string) {
    const accessToken = await this.getBadgrAuthToken();
    await axios.post(
      `${BADGR_API_URL}/badgeclasses/${newBadge}/assertions`,
      {
        issuer: BADGR_ISSUER_ID,
        recipient: {
          identity: email,
          type: 'email',
          hashed: false,
          salt: null,
          plainTextIdentity: email,
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }

  public async getUserBadges(email: string) {
    const accessToken = await this.getBadgrAuthToken();
    const res: any = await axios.get(`${BADGR_API_URL}/issuers/${BADGR_ISSUER_ID}/assertions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const awards = res.data.result;
    const userAwards = awards && awards.length > 0 ? awards.filter((award) => award.recipient.identity === email) : [];

    return userAwards;
  }

  private async getBadgrAuthToken() {
    const endpoint = 'https://api.badgr.io/o/token';

    const data = querystring.stringify({
      username: BADGR_USERNAME,
      password: BADGR_PASSWORD,
    });

    const response = await axios.post(endpoint, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  }
}
