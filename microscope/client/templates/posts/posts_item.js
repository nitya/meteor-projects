// 3.2 
// Item helper complements the data context passed down from the
// list template handler, by providing the relevant 'domain' context
Template.postItem.helpers({ 
	domain: function() {
		var a = document.createElement('a'); a.href = this.url;
		return a.hostname;
	} 
});