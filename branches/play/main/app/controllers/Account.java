package controllers;

import play.*;
import play.data.validation.Check;
import play.data.validation.Valid;
import play.mvc.*;

import java.util.*;

import models.*;

@With(Security.class)
public class Account extends Controller {

    @Before(unless = { "login", "register", "create" })
    static void checkAccess() throws Throwable {
	Secure.checkAccess();

	/*
	 * own login - altertnative for above, but then login failure goes
	 * Secure.Login
	 * 
	 * // See module secure Secure.checkAccess if(!Security.isConnected()) {
	 * flash.put("url", "GET".equals(request.method) ? request.url : "/");
	 * // seems a good default login(); } }
	 * 
	 * 
	 * public static void login() { flash.keep("url"); render();
	 */
    }

    public static void index() {
	render();
    }

    public static void register() throws Throwable {
	Object countries = Geonames.getCountries().get("geonames");
	render(countries);
    }

    public static void create(@Valid User user) throws Throwable {
	if (!validation.hasErrors()) {
	    user.save();
	    index();
	} else {
	    flash.error("error_validation");
	    params.flash(); // add http parameters to the flash scope
	    validation.keep(); // keep the errors for the next request
	    register();
	}
    }

    static User createShort(String firstname, String lastname, String email) {
	User user = new User();
	user.firstname = firstname;
	user.lastname = lastname;
	user.email = email;
	user.save();
	return user;
    }

    public static void logout(String url) throws Throwable {
	// stay on same page unless in account, see Seucrity.onDisconnected()
	if (url != null && !url.contains("/account/")) {
	    flash.put("url", url);
	}
	Secure.logout();
    }
    
    public static class Unique extends Check {

	@Override
        public boolean isSatisfied(Object validatedObject, Object value) {
	    String url = Play.ctxPath + "/secure/login";
	    if (params.get("url") != null) {
		url += "?url=" + params.get("url");
	    }
	    setMessage("text_account_already", url);
	    return User.find("byEmail", value).first() == null;
        }
    }
}