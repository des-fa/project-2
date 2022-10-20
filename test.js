import prisma from './src/controllers/_helpers/prisma.js'

const test = async () => {
  await prisma.tableA.create({
    data: {
      tableBs: {
        connectOrCreate: [
          {
            where: { name: 'running' },
            create: { name: 'running' }
          }, {
            where: { name: 'studying' },
            create: { name: 'studying' }
          }
        ]
      }
    }
  })

  await prisma.tableA.create({
    data: {
      tableBs: {
        connectOrCreate: [
          {
            where: { name: 'running' },
            create: { name: 'running' }
          }
        ]
      }
    }
  })

  const entriesBeforeDelete = await prisma.tableB.findFirst({
    where: {
      name: 'running'
    },
    include: {
      tableAs: true
    }
  })

  await prisma.tableA.delete({
    where: {
      id: entriesBeforeDelete.tableAs[0].id
    }
  })

  const entriesAfterDelete = await prisma.tableB.findFirst({
    where: {
      name: 'running'
    },
    include: {
      tableAs: true
    }
  })

  console.log(entriesBeforeDelete)
  console.log(entriesAfterDelete)
}

test()
