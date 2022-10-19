import yup from 'yup'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from './_check-ownership.js'

const updateSchema = yup.object({
  mood: yup.string().required(),
  gratitude: yup.string().required(),
  // using array of objects
  activities: yup.array().of(yup.object({
    activity: yup.string().required()
  })).required(),
  // using array of strings
  // activities: yup.array().of(yup.string().required()),
  post: yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
    tag: yup.string().required(),
    checked: yup.boolean().transform((value) => (!!value))
  }).default(undefined)
})

const controllersApiMyEntriesUpdate = async (req, res) => {
  try {
    const { params: { id }, body } = req
    const verifiedData = await updateSchema.validate(body, { abortEarly: false, stripUnknown: true })
    const updatedEntry = await prisma.entry.update({
      where: { id: Number(id) },
      data: {
        ...verifiedData,
        activities: {
          deleteMany: {},
          create: verifiedData.activities
        },
        post: {
          delete: true,
          create: verifiedData.post
        }
      },
      include: {
        activities: true,
        post: true
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
