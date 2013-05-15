define ['jquery', 'backbone', 'models/name-model'], ($, Backbone, NameModel) ->
	class NameCollection
		model: NameModel


	return NameCollection