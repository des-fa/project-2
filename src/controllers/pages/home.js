const controllersPagesHome = async (req, res) => {
  res.render('home', { layout: 'layouts/no-nav-layout' })
}

export default controllersPagesHome
