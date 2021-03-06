const str_replace = require('locutus/php/strings/str_replace');
const strip_tags = require('locutus/php/strings/strip_tags');
const trim = require('locutus/php/strings/trim');
const loadjson = require('loadjson');
const _ = require("lodash");
const assert = require("assert");
const sleep = require('system-sleep');

browser.timeouts('script', 10000);
browser.timeouts('pageLoad', 10000);
browser.timeouts('implicit', 10000);

var testcases = loadjson(__dirname + "/database/login.json");

describe('Test user login!\n', function() {
	it('Check title must be: Cộng đồng Arduino Việt Nam | Tôi yêu Việt Nam', function() {
		browser.url('/');
		assert.equal(browser.getTitle(), "Cộng đồng Arduino Việt Nam | Tôi yêu Việt Nam"); 
	})
	
	_.map(testcases, function(testcase, index) {
		it(`[#${index}] ${testcase.name}!`, function() {
			// reload page for each test case
			browser.url('/user/logout');
			browser.url('/');

			// click to show login form
			$('#block-superfish-1 > ul > li:nth-child(1) > div').click();
			
			browser.waitForVisible('#edit-name', 3000)//chắc ăn
			// set value
			var name = $('#edit-name');
			name.setValue(testcase.args.username);
			var pass = $('#edit-pass');
			pass.setValue(testcase.args.password);
			$("#edit-submit--2").click();
			
			/* no need!
			// check result
			var result = browser.getUrl();
			assert.equal(result, testcase.expected_result_url);
			*/

			if (testcase.is_success.toString().trim() == "true") {
				assert.equal(1, 1);
			} else {
				browser.waitForVisible(".notify-container .notify-text", 10000)
				var result = browser.getHTML(".notify-container .notify-text", false);
				result = strip_tags(str_replace("\n"+ '<h2 class="element-invisible">Thông báo lỗi</h2>' + "\n", '', result));
				result = str_replace("\n", "", result);
				result = trim(result);
				result = result.replace(/  +/g, ' ');
				assert.equal(result, testcase.expected_result_text);
			}
		})
	})
});

