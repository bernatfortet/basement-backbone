define ['jquery', 'backbone'], ($, Backbone) ->
	class NameModel
		defaults:
			attribute: "adsf"

		constructor: ->
			console.log("Router initialized")

	return NameModel