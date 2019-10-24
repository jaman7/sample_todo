require.config({
	baseUrl: 'js/',
	paths: {
		jquery: [
			'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min',
			'jsvendor/jquery.min'
		],
		popper: 'jsvendor/popper',
		bootstrap: 'jsvendor/bootstrap',
		sample_todo: 'todo'
	},
	shim: {
		popper: {
			deps: ['jquery'],
			exports: ['Popper']
		},
		bootstrap: {
			deps: ['jquery', 'popper'],
			exports: ['bootstrap']
		}
	}
});

require(['popper'], function(Popper) {
	window.Popper = Popper;
	require(['bootstrap']);
});

define(['jquery', 'bootstrap', 'sample_todo'], function($) {
	$('.dropdown').hover(
		function(e) {
			e.preventDefault();
			$(this)
				.find('.dropdown-menu')
				.stop(true, true)
				.delay(100)
				.slideDown(300);
		},
		function(e) {
			e.preventDefault();
			$(this)
				.find('.dropdown-menu')
				.stop(true, true)
				.delay(100)
				.slideUp(300);
		}
	);
});
