=== Plugin Name ===
Contributors: webheadllc
Tags: contact form 7, multistep form, form, multiple pages, store form
Requires at least: 3.4.1
Tested up to: 3.4.1
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Enables the Contact Form 7 plugin to create multi-page, multi-step forms.

== Description ==

I needed a contact form that spanned across multiple pages and in the end would send an email with all the info collected.  This plugin does just that.  This plugin requires the Contact Form 7 Wordpress plugin.

**Usage**
1. Create a contact form 7 form as you normally would.
1. Add a hidden tag named "step" with the value being the current step dash ("-") total steps.  If you have a 5-step form and you are creating the first step, the hidden field would look like:
[hidden step "1-5"]
the last step, would look like:
[hidden step "5-5"]
1. In the "Additional Settings" textarea at the bottom of the form editing page, add in the location of the next form.
If the next form is located on My2ndPage on example.com you would add the following to the "Additional Settings" textarea:
on_sent_ok: "location.replace('http://example.com/My2ndPage/');"
1. Repeat steps 1 - 3.  On the form that will actually send a email, do not do step 3 unless you want the form to redirect 
the user to another page.

**Additional Info**
The hidden field is taken directly from the "Contact Form 7 Modules".  If you have that installed, the Multi-Step plugin will use that.

Contact Form 7 has a nice success message after submitting its forms, but on a multi-step form, this can cause confusion if it shows and the page immediately leaves to the next page.  Add the functions below to your functions.php to hide the success messages on multi-step forms.
`<?php
/**
 * Hide form when done.
 */
function wh_hide_multistep_form($items, $result) {
    remove_filter('wpcf7_ajax_json_echo', 'wh_hide_multistep_form');
    if ($items['mailSent'] && !isset($items['onSentOk'])) {
        $items['onSentOk'] = array("$('" . $items['into'] . " form').children().not('div.wpcf7-response-output').hide();");
    }
    return $items;
}

/**
 * Add filter to clear form if this is a multistep form.
 */
function wh_cf7_before_mail($cf7) {
    if (isset($_SESSION['step'])) {
        add_filter('wpcf7_ajax_json_echo', 'wh_hide_multistep_form', 10, 2);
    }
}
add_action( 'wpcf7_before_send_mail', 'wh_cf7_before_mail', 8 );
?>`

== Frequently Asked Questions ==

= Why did you do this? =

I have used countless free plugins and have saved countless hours.  I could not find any plugin that does multi page forms, but have seen a few requests for it.  I decided to give some hours back.


== Changelog ==

= 1.0 =
Initial release.
