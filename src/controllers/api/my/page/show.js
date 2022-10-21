import moment from 'moment'
import fetch from 'node-fetch'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

// const generateQuote = async () => {
//   const url = 'https://type.fit/api/quotes'

//   const response = await fetch(url)
//   const allQuotes = await response.json()
// const randomIdx = Math.floor(Math.random() * allQuotes.length)
// const quoteText = allQuotes[randomIdx].text
// const auth = allQuotes[randomIdx].author

// if (!auth) { author = 'Anonymous' }
// document.getElementById('QuoteText').innerHTML = quoteText
// document.getElementById('author').innerHTML = `~ ${auth}`
// }

const controllersApiMyPageShow = async (req, res) => {
  try {
    const randomQuote = await fetch('https://api.quotable.io/random?tags=motivational|inspirational')
      .then((response) => response.json())
      .then(
        (data) => ({
          content: data.content,
          author: data.author
        })
      )
    // const quote = fetch('https://api.quotable.io/random?tags=motivational|inspirational')
    //   .then((response) => response.json())
    //   .then((data) => data)
    // const generateQuote = () => {
    //   quote.then((a) => {
    //     console.log(a)
    //     return a
    //   })
    // }

    // generateQuote()

    const { session: { user: { id: userId } } } = req
    const currentDate = moment().toDate()

    const foundEntry = await prisma.entry.findFirst({
      where: {
        userId: Number(userId),
        createdAt: {
          equals: currentDate
        }
      },
      include: {
        activities: {
          select: {
            activity: true
          }
        },
        post: {
          include: {
            tags: true
          }
        }
      },
      rejectOnNotFound: true
    })
    return res.status(200).json({
      entry: foundEntry,
      quote: randomQuote })
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  // generateQuote,
  controllersApiMyPageShow
]
