package controllers;

import models.User;
import play.mvc.Controller;
import play.mvc.With;
import play.test.Fixtures;

@With(Security.class)
public class Application extends Controller {

    public static void index() {
	render();
    }
    
    public static void messages() {
	render();
    }

    public static void init() {
      if(User.count() == 0) {
          Fixtures.loadModels("initial-data.yml");
      }
  }
}