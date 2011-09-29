package controllers;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import play.Logger;
import play.data.validation.Required;
import play.i18n.Lang;
import play.libs.WS;
import play.mvc.Controller;
import play.vfs.VirtualFile;

public class Geonames extends Controller {

    private static JsonObject getGeonamesLocal(VirtualFile vf)
	    throws IOException {
	Reader in = new InputStreamReader(
	        new GZIPInputStream(vf.inputstream()), "UTF-8");
	JsonElement geonames = new JsonParser().parse(in);
	return geonames.getAsJsonObject();
    }

    private static JsonObject getGeonames(String ws) {
    	VirtualFile vf = VirtualFile.fromRelativePath("/cache/geonames-"
    	        + ws.replace('?', '_') + "-" + Lang.get() + ".json.gz");
    	try {
	    if (!vf.exists()) {
		WS.HttpResponse response = WS.url(
		        "http://ws.geonames.org/" + ws + "&style=short&lang="
		                + Lang.get()).get();
		InputStream in = response.getStream();
		OutputStream out = new GZIPOutputStream(vf.outputstream());
		int count;
		byte data[] = new byte[512];
		while ((count = in.read(data, 0, 512)) > 0) {
		    out.write(data, 0, count);
		}
		out.flush();
		out.close();
	    }
	    return getGeonamesLocal(vf);
	} catch (IOException e) {
	    Logger.error(e, "Can't create geonames file {1} : {2}", vf.getName(), e.getMessage());
	    return new JsonObject();
	}
    }

    static JsonObject getCountries() {
	return new JsonObject(); //getGeonames("countryInfoJSON?maxRows=300");
    }

    public static void reset() {
	VirtualFile vf = VirtualFile.fromRelativePath("/cache/");
	File directory = vf.getRealFile();

	File[] toBeDeleted = directory.listFiles(new FileFilter() {
	    public boolean accept(File theFile) {
		if (theFile.isFile()) {
		    return theFile.getName().startsWith("geonames-");
		}
		return false;
	    }
	});
	for (File deletableFile : toBeDeleted) {
	    deletableFile.delete();
	}

    }

    public static void countries() {
	JsonObject countries = getCountries();
	renderJSON(countries.toString());
    }


    public static void zones(@Required String countryId) {
	if (!validation.hasErrors()) {
	    JsonObject zones = getGeonames("childrenJSON?geonameId="
		    + countryId);
	    renderJSON(zones.toString());
	} else {
	    error("countryId is required");
	}
    }
}