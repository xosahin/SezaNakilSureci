/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"SezaNakilSureci/SezaNakilSureci/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});