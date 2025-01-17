const keystone = require("keystone");

const User = keystone.list("User");
const FileData = keystone.list("FileUpload");

exports = module.exports = function (req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;

	FileData.model.find({ name: res.locals.user.id }).exec(function (err, item) {
		if (err) {
			req.flash("warning", "Database error!");
		}
		if (!item) {
			req.flash("warning", "User not found!");
		}

		if (item[0] === undefined) {
			locals.filePath = "/images/members/default-profile.jpg";
		} else {
			if (item[0].url === undefined) {
				locals.filePath = "/images/members/default-profile.jpg";
			} else {
				locals.filePath = item[0].url;
			}
		}

		// Render the view
		view.render("profile");
	});
};

/**
 * Update user profile
 */
exports.update = function (req, res, next) {
	User.model.findById(res.locals.user.id).exec(function (err, item) {
		if (err) {
			req.flash("warning", "Database error!");
		}
		if (!item) {
			req.flash("warning", "User not found!");
		}

		let publicProfile;

		publicProfile = req.body.public === "on";

		let formData = {
			name: { first: req.body.first, last: req.body.last },
			linkedin: req.body.linkedin,
			github: req.body.github,
			website: req.body.website,
			about: req.body.about,
			public: publicProfile,
		};

		let data = (req.method === "POST") ? formData : req.query;

		let can_submit = true;

		if (req.body.new_password) {
			if (req.body.new_password !== req.body.confirm_new_password) {
				can_submit = false;
			} else {
				formData.password = req.body.new_password;
			}
		}

		if (can_submit === true) {
			item.getUpdateHandler(req).process(data, {
				flashErrors: true,
			}, function (err) {
				if (err) {
					req.flash("warning", "Error updating profile!");
					res.locals.validationErrors = err.errors;
				} else {
					req.flash("success", "Your profile has been updated!");
					return res.redirect("/profile");
				}
				next();
			});
		} else {
			req.flash("warning", "A password deve ser igual");
			return res.redirect("/profile");
		}
	});
};
