package controllers;

import play.*;
import play.cache.Cache;
import play.data.validation.Required;
import play.i18n.Lang;
import play.i18n.Messages;
import play.libs.Crypto;
import play.mvc.*;

import java.lang.reflect.Type;
import java.util.*;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import models.*;

@With(Security.class)
public class Application extends Controller {

    public static void index() {
	render();
    }
    
    public static void messages() {
	render();
    }
}