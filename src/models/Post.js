let keystone = require("keystone");
let Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

let Post = new keystone.List("Post", {
	map: { name: "title" },
	autokey: { path: "slug", from: "title", unique: true },
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: "draft, published, archived", default: "draft", index: true },
	author: { type: Types.Relationship, ref: "User", index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: "published" } },
	image: { type: String, label: "Image path on disk" },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: "PostCategory", many: true },
});

Post.schema.virtual("content.full").get(function () {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = "title, state|20%, author|20%, publishedDate|20%";
Post.register();
