import yup from 'yup'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from './_check-ownership.js'

const updateSchema = yup.object({
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
    ).min(1).required()
  }).default(undefined)
})

const controllersApiMyEntriesUpdate = async (req, res) => {
  try {
    const { params: { id }, body, session: { user: { id: userId } } } = req
    const verifiedData = await updateSchema.validate(body, { abortEarly: false, stripUnknown: true })
    const updatedEntry = await prisma.entry.update({
      where: { id: Number(id) },
      data: {
        ...verifiedData,
        activities: {
          set: [],
          connectOrCreate: verifiedData.activities.map((activity) => ({
            where: activity,
            create: activity
          }))
        },
        post: {
          upsert: verifiedData.post ? {
            create: {
              ...verifiedData.post,
              user: {
                connect: {
                  id: userId
                }
              },
              tags: {
                connectOrCreate: verifiedData.post.tags.map((tag) => ({
                  where: tag,
                  create: tag
                }))
              }
            },
            update: {
              ...verifiedData.post,
              tags: {
                set: [],
                connectOrCreate: verifiedData.post.tags.map((tag) => ({
                  where: tag,
                  create: tag
                }))
              }
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
    return res.status(200).json(updatedEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  checkOwnership,
  controllersApiMyEntriesUpdate
]
