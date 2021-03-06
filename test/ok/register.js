const str_replace = require('locutus/php/strings/str_replace');
const strip_tags = require('locutus/php/strings/strip_tags');
const trim = require('locutus/php/strings/trim');
const loadjson = require('loadjson');
const _ = require("lodash");
const assert = require("assert");

browser.timeouts('script', 60000);
browser.timeouts('pageLoad', 30000);

var testcases = loadjson(__dirname + "/database/register.json");

describe('Test user register!\n', function() {
	
	it('Check title must be: Tài khoản người dùng | Cộng đồng Arduino Việt Nam', function() {       
		browser.url('/user/register');//chuyển vào đây, cấm để ở ngoài
		assert.equal(browser.getTitle(), "Tài khoản người dùng | Cộng đồng Arduino Việt Nam"); 
		
	})
	
	_.map(testcases, function(testcase, index) {
		it(`[#${index}] ${testcase.name}!`, function() {  
			browser.url('/user/register');//chuyển vào đây, cấm để ở ngoài
			browser.waitForVisible('.username', 3000)//chắc ăn
			
			var username = $('.username');
			var email = $('#edit-mail');
			var password = $(".password-field");
			var password_confirm = $('#edit-pass-pass2');
			
			username.setValue(testcase.args.username);
			email.setValue(testcase.args.email);
			password.setValue(testcase.args.password);
			password_confirm.setValue(testcase.args.password_confirm);
			
			// submit
			$("#edit-submit").click();
			
			// result
			browser.waitForVisible('.notify-container', 6000)//chắc ăn
			var result = browser.getHTML(".notify-container .notify-text", false);
			result = strip_tags(str_replace("\n"+ '<h2 class="element-invisible">Thông báo lỗi</h2>' + "\n", '', result));
			result = str_replace("\n", "", result);
			result = trim(result);
			result = result.replace(/  +/g, ' ');
			assert.equal(result, testcase.expected_result);
		})
	})
});

