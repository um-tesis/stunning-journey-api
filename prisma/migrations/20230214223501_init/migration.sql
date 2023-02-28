-- CreateTable
CREATE TABLE "Project" (
    "project_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "organization_id" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "ProjectUser" (
    "project_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" INTEGER,

    CONSTRAINT "ProjectUser_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
