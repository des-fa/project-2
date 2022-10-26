import yup from 'yup'
import moment from 'moment'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

const createSchema = yup.object({
  mood: yup.string().required(),
  gratitude: yup.string().required(),
  // using array of objects
  activities: yup.array().of(yup.object({
    activity: yup.string().transform((value) => value.toUpperCase()).required()
  })).required(),
  // using array of strings
  // activities: yup.array().of(yup.string().required()),
  post: yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
    checked: yup.boolean().transform((value) => (!!value)),
    tags: yup.array().of(
      yup.object({
        name: yup.string().transform((value) => value.toUpperCase()).required()
      })
    )
    // .min(1).required()
  }).default(undefined)
})

const controllersApiMyEntriesCreate = async (req, res) => {
  try {
    const { body, session: { user: { id: userId } } } = req
    // const userId = req.session.user.id
    const currentDate = moment().toDate()
    const verifiedData = await createSchema.validate(body, { abortEarly: false, stripUnknown: true })

    const foundEntry = await prisma.entry.findFirst({
      where: {
        createdAt: currentDate
      }
    })

    const newEntry = foundEntry ? 'Entry already exists' : await prisma.entry.create({
      data: {
        // title: verifiedData.title,
        // description: verifiedData.description,
        ...verifiedData,
        user: {
          connect: {
            id: userId
          }
        },
        // what they expect
        // activities: {
        //   create: [
        //     { activity: 'act1' },
        //     { activity: 'act2' },
        //   ]
        // }
        // what you did
        // activities: {
        //   create: ['act1', 'act2']
        // }
        // using array of objects
        activities: {
          connectOrCreate: verifiedData.activities.map((activity) => ({
            where: activity,
            create: activity
          }))
        },
        // using array of strings
        // activities: {
        //   create: verifiedData.activities.map((activity) => ({
        //     activity
        //   }))
        // },
        post: {
          create: verifiedData.post ? {
            ...verifiedData.post,
            user: {
              connect: {
                id: userId
              }
            },
            tags: {
              connectOrCreate: verifiedData.post.tags?.map((tag) => ({
                where: tag,
                create: tag
              }))
            }
          } : undefined
        }
      },
      include: {
        activities: true,
        post: {
          include: {
            tags: true
          }
        }
      }
    })
    return res.status(201).json(newEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiMyEntriesCreate
