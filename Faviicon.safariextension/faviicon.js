// Web & App
// Dipl.-Ing. Matthias Jung
// Matthias Jung, 2016
// info@webappjung.de

var Faviicon = {};

Faviicon.add = function()
{
	var serv = safari.extension.settings.serv;
    if(serv == "")
    {
	    var str = "Please Configure Toolbar in Safari Settings!";
        $("#content").append(str);
    }
    else 
    {
        var url = safari.application.activeBrowserWindow.activeTab.url;
        var title = safari.application.activeBrowserWindow.activeTab.title;

        if(url != "" && title != "")
        { 
            var c=encodeURIComponent;

            var source = serv +
                'index.php/apps/bookmarks/bookmarklet?output=popup&url='+
                c(url) + 
                '&title=' + 
                c(title);

            var newTab=safari.self.browserWindow.openTab();
            newTab.url=source;
        }
    }
}

//Faviicon.ImageExist = function(url)
//{
//    var img = new Image();
//    img.src = url;
//    return img.height != 0;
//}

Faviicon.get = function(url)
{
    $.getJSON( url, function( data )
    {
        $.each(data, function (key, val)
        {
            // Full Url:
            var fullurl = val.url;

            // Get Base Url:
            var tmp = document.createElement("a"); 
            tmp.href = fullurl;
            var baseurl = tmp.origin;
            var faviconurl = baseurl + "/favicon.ico";

            // Other Data:
            var title = val.title;

            // Render Content:
            //
            // TODO: ADD THIS SVG IN CASE THE FAVICON IS NOT FOUND:
            //if(Faviicon.ImageExist(faviconurl) == false)
            //{
            //    var str = "<a href=\"" + fullurl + "\">" +
            //        "<svg width=\"16\" height=\"16\">" +
            //        "<rect x=\"0\" y=\"0\" rx=\"2\" ry=\"2\" width=\"16\" height=\"16\"" +
            //        "style=\"fill:grey;stroke:none;stroke-width:1;opacity:1\" />" +
            //        "<text fill=\"#ffffff\" text-anchor=\"middle\" font-family=\"Verdana\" " + 
            //        "font-size=\"10\" x=\"8\" y=\"12\">" +
            //        title.charAt(0).toUpperCase() +
            //        "</text>" +
            //        "Sorry, your browser does not support inline SVG." +
            //        "</svg>" +
            //        "</a>";
            //    $("#content").append(str);
            //}
            //else
            //{
                var str = "<a href=\"" + fullurl + "\">" +
                    "<img src=\"" + faviconurl + "\"" +
                    "onerror=\"this.src='http://www.google.com/s2/favicons?domain_url=" + fullurl + "';\"" +
                    "width=\"16\" height=\"16\" alt=\"\" title=\"\" url_piece=\"/\">" +
                    "</a>";
                $("#content").append(str);
            //}
        });
    });
}

Faviicon.onLoad = function()
{
    // Get Configuration:
	var user = safari.extension.settings.user;
	var pass = safari.extension.settings.pass;
	var serv = safari.extension.settings.serv;

    // Get Conent Handler:
	var content = document.getElementById("content");

    if((user == "") || (pass == "") || (serv == ""))
    {
	    var str = "Please Configure Toolbar in Safari Settings!";
        $("#content").append(str);
    }
    else 
    {
        Faviicon.get(serv+"index.php/apps/bookmarks/public/rest/v1/bookmark?user="+user+"&password="+pass);
        var button = "<input type=\"button\" value=\"+\" onclick=\"Faviicon.add();\" class=\"buttonc\">";
        $("#add").append(button);
    }
}

Faviicon.settingsChanged = function(event)
{
	if(event.key == "user") {
		Faviicon.onLoad();
	}
	else
    {
		Faviicon.onLoad();
    }
}

safari.extension.settings.addEventListener("change", Faviicon.settingsChanged, false);
