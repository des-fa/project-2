import yup from 'yup'
import bcrypt from 'bcrypt'
import _ from 'lodash'

import prisma from '../../../../_helpers/prisma.js'
import handleErrors from '../../../../_helpers/handle-errors.js'
import uploadFileAsync from '../../../../_helpers/upload-file.js'

const updateSchema = yup.object({
  email: yup.string().email().test({
    message: () => 'Email already exists',
    test: async (value) => {
      try {
        await prisma.user.findUnique({ where: { email: value }, rejectOnNotFound: true })
        return false
      } catch (err) {
        return true
      }
    }
  }),
  username: yup.string().notRequired().min(6, 'Mininum 6 characters').max(15, 'Maximum 15 characters')
    .nullable()
    .transform((value) => (value || null))
    .test({
      message: () => 'Username already exists',
      test: async (value) => {
        try {
          await prisma.user.findUnique({ where: { username: value }, rejectOnNotFound: true })
          return false
        } catch (err) {
          return true
        }
      }
    }),
  // yup.string().when('username', (value) => {
  //   if (value) {
  //     return yup
  //       .string()
  //       .min(6, 'Username must be more than 6 characters long')
  //       .max(15, 'Username must be less than 15 characters long')
  //   }
  //   return yup
  //     .string()
  //     .transform((value, originalValue) => {
  //       // Convert empty values to null
  //       if (!value) {
  //         return null
  //       }
  //       return originalValue
  //     })
  //     .nullable()
  //     .optional()
  // }),
  password: yup.string().test(
    'empty-or-6-characters-check',
    'Password must be at least 6 characters',
    (password) => !password || password.length >= 6
  ),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
  avatar: yup.mixed()
})

const controllersApiMyUserSettingsUpdate = async (req, res) => {
  try {
    const { body, session: { user: { id } } } = req
    const verifiedData = await updateSchema.validate(body, { abortEarly: false, stripUnknown: true })
    await uploadFileAsync(verifiedData, req)

    const dataToSave = {
    }

    if (verifiedData.email) {
      dataToSave.email = verifiedData.email
    }

    if (verifiedData.username) {
      dataToSave.username = verifiedData.username
    }

    if (verifiedData.password) {
      dataToSave.passwordHash = await bcrypt.hash(verifiedData.password, 10)
    }

    if (verifiedData.avatar) {
      dataToSave.avatar = verifiedData.avatar
    }

    const foundUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToSave
    })
    return res.status(200).json(_.omit(foundUser, ['passwordHash']))
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiMyUserSettingsUpdate
