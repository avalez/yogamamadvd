package controllers;

import models.User;
import play.mvc.Before;

public class Security extends Secure.Security {
    @Before
    static void setConnectedUser() {
      if (Security.isConnected()) {
        User user = User.find("byEmail", Security.connected()).first();
        renderArgs.put("user", user.firstname);
      }
    }
    
    static void setConnectedUser(User user) {
      session.put("username", user.email);
      renderArgs.put("user", user.firstname);
    }

    static boolean authentify(String username, String password) {
      return User.find("byEmailAndPassword", username, password).first() != null;
    }

    static boolean check(String profile) {
      if ("admin".equals(profile)) {
        return User.find("byEmail", connected()).<User> first().isAdmin;
      }
      return false;
    }

    static void onAuthenticated() {
      // stay on same page unless in account, see Account.logout()
      String returnUrl = params.get("url");
      if (returnUrl != null && !"".equals(returnUrl)) {
        redirect(returnUrl);
      }
    }

    static void onDisconnected() {
      // stay on same page unless in account, see Account.logout()
      String returnUrl = flash.get("url");
      redirect(returnUrl == null ? "/" : returnUrl);
    }
}