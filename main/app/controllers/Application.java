package controllers;

import play.mvc.Controller;
import play.mvc.With;

@With(Security.class)
public class Application extends Controller {

    public static void index() {
	render();
    }
    
    public static void messages() {
	render();
    }
}