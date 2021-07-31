exports.get404Page = (req, res, next) => {
	res.status(404).render("errors/404", {title: "404 Not Found"})
}
