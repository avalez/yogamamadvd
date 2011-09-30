package controllers;

import com.google.gson.Gson;

import models.User;
import play.data.validation.CheckWith;
import play.data.validation.Email;
import play.data.validation.Required;
import play.data.validation.Valid;
import play.libs.Crypto;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.With;

@With(Security.class)
public class WS extends Controller {

  // Main ///////////////////////////////////////////////////////////////////

  // Account ////////////////////////////////////////////////////////////////

  public static void register(@Valid User user) {
    if (!validation.hasErrors()) {
      user.save();
      renderJSON(user);
    } else {
      error("Errors: " + validation.errorsMap());
    }
  }
  
  public static void checkEmail(@Valid User user) {
    if (!validation.hasError("user.email")) {
      renderJSON(Boolean.TRUE);
    }
  }

  public static void connect(@Required @Email String username, @Required String password, boolean remember) {
    if (!validation.hasErrors()) {
      User user = User.find("byEmailAndPassword", username, password).first();
      if (user != null) {
        // Mark user as connected
        session.put("username", username);
        // Remember if needed
        if (remember) {
          response.setCookie("rememberme",
              Crypto.sign(username) + "-" + username, "30d");
        }
        user.password = "***";
        renderJSON(user);
      } else {
        forbidden();
      }
    } else {
      error("Errors: " + validation.errorsMap());
    }
  }

  private static boolean remembered() {
    Http.Cookie remember = request.cookies.get("rememberme");
    if (remember != null && remember.value.indexOf("-") > 0) {
      String sign = remember.value.substring(0, remember.value.indexOf("-"));
      String username = remember.value
          .substring(remember.value.indexOf("-") + 1);
      if (Crypto.sign(username).equals(sign)) {
        session.put("username", username);
        return true;
      }
    }
    return false;
  }

  public static void connected() {
    if (Security.isConnected() || remembered()) {
      User user = User.find("byEmail", Security.connected()).first();
      user.password = "***";
      renderJSON(user);
    } else {
      forbidden();
    }
  }

  public static void disconnect() {
    session.clear();
    response.removeCookie("rememberme");
  }
}