exports.get404Page = (req, res, next) => {
	res.status(404).render("errors/404", {title: "404 Not Found"})
}
exports.get500Page = (req, res, next) => {
	res.status(500).render("errors/500", {title: "404 Not Found"})
}
