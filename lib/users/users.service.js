"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const prisma_service_1 = require("../prisma/prisma.service");
const common_1 = require("@nestjs/common");
const crypto_helper_1 = require("../helpers/crypto.helper");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserInput) {
        const hashedPassword = (0, crypto_helper_1.hashPassword)(createUserInput.password);
        const newUser = Object.assign(Object.assign({}, createUserInput), { password: hashedPassword });
        return await this.prisma.user.create({
            data: newUser,
        });
    }
    async findAll() {
        return await this.prisma.user.findMany();
    }
    async findOne(id) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    async update(id, updateUserInput) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: updateUserInput,
        });
    }
    async remove(id) {
        return await this.prisma.user.delete({
            where: {
                id,
            },
        });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map