<div id="logo-image">
</div>
</header>
<section id="first-form">
<form action="/webformmailer.php" method="post" autocomplete="on">
<h4>Enrollment Form</h4>
<input type="hidden" name="redirect" value="thankyou.html" />
<label for="fname">Name:</label>
<input type="text" name="fname" autofocus="autofocus" placeholder="First name" required="required" />
<label for="lname">Last name:</label>
<input type="text" name="lname" autofocus="autofocus" placeholder="Last name" required="required" />
<label for="email">Email:</label>
<input type="email" name="email" placeholder="Your email@yourdomain.com" required="required" />
<label for="date">Birthday:</label>
<input type="date" name="bday" placeholder="Pick your birthday please" required="required" />
<label for="telephone number">Telephone:</label>
<input type="tel" name="telephone number" placeholder="Your telephone number" required="required"/>
<input type="submit" />
</form>
