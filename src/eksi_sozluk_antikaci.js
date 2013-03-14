// ==UserScript==
// @name        eksi sozluk antikaci
// @namespace   https://github.com/kolpazar
// @include     http://eksisozluk.com/*
// @include     https://eksisozluk.com/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0
// ==/UserScript==

function EksiBetaAparati() {

    var $ = undefined;
    var currentTheme = undefined;
    var styles = "";
    
    var betaConfig = {
        removeAd: true,
        removeAside: true,
        imageSearch: true,
        moveChannels: true,
        denseTopics: true,
        topicActivityInBrackets: true,
        ellipsisForToday: true,
        expandContent: true,
        entryNumbersOnLeftSide: true,
        entryOptionsOnHover: true,
        transparentHeader: true,
        fullWidth: false,
        theme: "herzamanki_yeni"
    };
    
    var defaultTheme = "herzamanki_yeni";
    var themes = {
        "herzamanki_yeni": {
            name: "her zamanki (yeni)",
            backgroundColor: "#EBEBEB",
            text: "#000",
            link: "#00338F",
            linkHover: "#00338F",
            linkHoverBack: "#D3E2CE",
            headerShadow: "#999",
            listShadow: "#DEDEDE",
            buttonBorder: "#2D4261",
            buttonBack: "#456695",
            buttonGradTo: "#3D5A84",
            buttonText: "#FFF"
        },
        "herzamanki_eski": {
            name: "her zamanki (antik)",
            backgroundColor: "#CCC",
            text: "#000",
            link: "#000080",
            linkHover: "#000080",
            linkHoverBack: "#C0C0C0",
            headerShadow: "#999",
            listShadow: "#C0C0C0",
            buttonBorder: "#2D4261",
            buttonBack: "#456695",
            buttonGradTo: "#3D5A84",
            buttonText: "#FFF"
        },
        "herzamanki_enhanced": {
            name: "her zamanki enhanced",
            backgroundColor: "#CCC",
            background: '#CCC url("http://antik.eksisozluk.com/css/he_back.jpg") repeat-x fixed bottom',
            headerBackground: '#CCC url("http://antik.eksisozluk.com/css/he_top.jpg") repeat-x fixed top',
            logo: 'url("")',
            text: "#000",
            link: "#1C2B63",
            linkHover: "#1C2B63",
            linkHoverBack: "#C5C5C5",
            headerShadow: "#999",
            listShadow: "#C0C0C0",
            buttonBorder: "#2D4261",
            buttonBack: "#4C5B73",
            buttonGradTo: "#3C4B60",
            buttonText: "#FFF"
        },
        "cokpis": {
            name: "cok pis",
            backgroundColor: "#B1AC99",
            background: '#B1AC99 url("http://antik.eksisozluk.com/css/pis_bg.jpg") fixed',
            headerBackground: '#B1AC99 url("http://antik.eksisozluk.com/css/pis_top.jpg") repeat-x fixed top',
            logo: 'url("http://antik.eksisozluk.com/css/pis_logo.jpg")',
            text: "#36312E",
            link: "#FFF",
            linkHover: "#FFF",
            linkHoverBack: "#BA7663",
            headerShadow: "#716863",
            listShadow: "#9F938B",
            titleBack: "#BA7663",
            buttonBorder: "#2D4261",
            buttonBack: "#4C5B73",
            buttonGradTo: "#3C4B60",
            buttonText: "#FFF"
        },
        "dietcoke": {
            name: "diet coke",
            backgroundColor: "#EAEAEA",
            text: "#000",
            link: "#AE0311",
            linkHover: "#AE0311",
            linkHoverBack: "#FFF",
            headerShadow: "#999",
            listShadow: "#D9D9D9",
            buttonBorder: "#800000",
            buttonBack: "#AE0311",
            buttonGradTo: "#9E2011",
            buttonText: "#FFF"
        }
    };
    
    function eksiAddStyle(style) {
        styles += style + "\n";
    }
    
    function insertStyle(style) {
        var channelStyle = document.createElement("style");
        channelStyle.type = "text/css";
        channelStyle.innerHTML = style;
        document.documentElement.appendChild(channelStyle);
    }
    
    function commitStyles() {
        insertStyle(styles);
    }
    
    function removeAd() {
        if (betaConfig.removeAd) {
            var adTheme = $("#adtheme");
            if (adTheme.length !== 0) {
                $.cookie("notheme", 1);
                adTheme.remove();
                $("#return-to-innocence").remove();
            }
        }
    }
    
    function removeAside() {
        if (betaConfig.removeAside) {
            $("#aside").remove();
        }
    }
    
    function titleImageSearch() {
        if (betaConfig.imageSearch) {
            var title = $("#title");
            if (title.length !== 0) {
                $.getJSON("https://ajax.googleapis.com/ajax/services/search/images?callback=?&v=1.0&rsz=1&q=" + String.trim(title.text()), function(data) {
                    if (data.responseData.results.length > 0) {
                        var imageEl = $("<a href=\"" + unescape(data.responseData.results[0].url) + "\" target=\"_blank\"><img src=\"" + unescape(data.responseData.results[0].tbUrl) + "\" /></a>");
                        imageEl.css({'float':'right'});
                        imageEl.prependTo($("#topic"));
                        $(".pager").css({'clear':'both'});
                        $("#entry-list").css({'clear':'both'});
                    }
                });
            }
        }
    }
    
    function moveChannels() {
        if (betaConfig.moveChannels) {
            var channels = $("#topic-channel-info");
            if (channels.length !== 0) {
                channels.appendTo($(".sub-title-menu"));
                $("#topic-channels > h2").css({'display':'none'});
                $("#topic-channel-info #topic-channels a").css({'font-size':'0.9em'});
                $("#topic-channel-suggestion-menu").css({'min-width':'150pt'});
            }
        }
    }
    
    function restyleTopics() {
        if (betaConfig.ellipsisForToday || betaConfig.topicActivityInBrackets) {
            $("#partial-index li").each(function() {
                var topic = $(this);
                if (topic.attr("class") == "seperated") {
                    return
                }
                var topicLink = topic.children("a");
                topic.html(topic.html().trim());

                topicNewEntryCount = topic.find("small");
                if (topicNewEntryCount.length > 0) {
                    if (betaConfig.topicActivityInBrackets) {
                        topicNewEntryCount.text("(" + topicNewEntryCount.text() + ")");
                    } else {
                        topicNewEntryCount.css({'float':'right'});
                    }
                    topicNewEntryCount.remove();
                    topicNewEntryCount.appendTo(topic);
                }
                if (betaConfig.ellipsisForToday) {
                    var topicParamPos = topicLink.attr("href").indexOf("?");
                    if (topicParamPos >= 0) {
                        var topicNewEntries = topicLink.clone();
                        topicLink.attr("href", topicLink.attr("href").substr(0, topicParamPos));
                        topicNewEntries.html("...");
                        topicNewEntries.addClass("topictoday");
                        topicNewEntries.appendTo(topic);
                    }
                }
            });
        }
    }

    function restyleContent() {
        $("#entry-list").css({'margin-top':'0'});
        if (betaConfig.expandContent) {
            $("#content-section").css({'width':'auto','float':'none'});
            $("#index-section").css({'width':'240px'});
            $("#main").css({'margin-left':'240px'});
            if (!betaConfig.removeAside) {
                $("#content-section").css({'margin-right':'320px'});
                $("#aside").css({'width':'300px','float':'none','position':'absolute','top':'0','right':'0'});
            }
        }
        if (betaConfig.entryOptionsOnHover) {
            eksiAddStyle("#entry-list > li .feedback, #entry-list > li .options { visibility: hidden; } #entry-list > li:hover .feedback, #entry-list > li:hover .options { visibility: visible; }");
        }
        if (betaConfig.transparentHeader) {
            $("header").css({'background-color': currentTheme.backgroundColor});
            $("#sub-navigation").css({'background-color': currentTheme.backgroundColor});
            eksiAddStyle("#sub-navigation a { color: " + currentTheme.link + "; } #sub-navigation a:hover { color: " + currentTheme.linkHover + " !important; background-color: " + currentTheme.linkHoverBack + " } ");
            eksiAddStyle("#a3-toggle, #top-navigation > ul > li > a { color: " + currentTheme.link + "; }");
            
        }
        if (betaConfig.fullWidth) {
            eksiAddStyle("#container { width: auto; max-width: none; padding: 10px 20px 0 20px } html > body > header #top-bar { width: auto; padding: 0 20px }");
        }
    }
    
    function moveEntryNumbers() {
        if (betaConfig.entryNumbersOnLeftSide) {
            eksiAddStyle("#entry-list { padding-left: 35pt; position: relative }");
            eksiAddStyle("#entry-list > li:before { color: #000; font-size: 1em; border-width: 0px; top: 0; position: absolute; left: -52pt; text-align: right; width: 45pt; content: attr(value) \".\"; }");
            eksiAddStyle("#entry-list > li:not(:first-child) { margin-top: 10px !important; } #entry-list > li:not(:last-child) { border-bottom: 1px solid " + currentTheme.listShadow + "; } #entry-list > li { padding-bottom: 10px; }");
        }
    }
    
    function selectTheme() {
        currentTheme = themes[betaConfig.theme];
        if (!currentTheme) {
            currentTheme = themes[defaultTheme];
        }
    }
    
    function applyTheme() {
        eksiAddStyle("body, header, #top-bar > #advanced-search-form, .ui-autocomplete, .dropdown .dropdown-menu, .share-dialog, #in-topic-search-options, #topic-channel-info #topic-channel-suggestion-menu { background: " + currentTheme.backgroundColor + "; border-color: " + currentTheme.headerShadow + "; color: " + currentTheme.text + " }");
        if (currentTheme.background) {
            eksiAddStyle("body { background: " + currentTheme.background + " }");
        }
        if (betaConfig.transparentHeader) {
            if (currentTheme.headerBackground) {
                eksiAddStyle("header { background: " + currentTheme.headerBackground + " }");
            }
            if (currentTheme.logo) {
                eksiAddStyle("#logo a { background-image: " + currentTheme.logo + " }");
            }
        }
        if (currentTheme.titleBack) {
            eksiAddStyle("#title { background: " + currentTheme.titleBack + " }");
        }
        eksiAddStyle("a { color: " + currentTheme.link + " } html.no-touch .pager > a:hover, html.no-touch .topic-list li > a:hover, html.no-touch #feed-refresh-link:hover, html.no-touch .dropdown .dropdown-menu li > a:hover  { color: " + currentTheme.linkHover + "; background-color: " + currentTheme.linkHoverBack + "} ");
        eksiAddStyle(".pager > a, #feed-refresh-link, .topic-list li, #entry-list > li:before, fieldset legend, .dropdown .dropdown-menu li.seperated { border-color: " + currentTheme.listShadow + " }");
        eksiAddStyle("button.primary, input.primary[type=\"submit\"], input.primary[type=\"button\"] { background-color: " + currentTheme.buttonBack + "; background-image: -moz-linear-gradient(center top , " + currentTheme.buttonBack + ", " + currentTheme.buttonGradTo + "); border-color: " + currentTheme.buttonBorder + "; color: " + currentTheme.buttonText + " }");

        if (currentTheme.headerShadow) {
            eksiAddStyle("header { box-shadow: 0 1px 2px 1px " + currentTheme.headerShadow + "; }");
        }
    }
    
    function createSettingsMenuEntry() {
        var showConf = $('<li><a id="aparat-config" href="#">aparat</a></li>');
        if ($("#top-navigation").hasClass("loggedin")) {
            $("#top-navigation ul li ul li.seperated").before(showConf);  
        } else {
            $("#top-navigation ul").append(showConf);
        }
        $("#aparat-config").click(showConfig);
    }
    
    function configCheckbox(configName, desc) {
        return '<div><label class="checkbox"><input type="checkbox" id="EksiBeta_' + configName + '"' + (betaConfig[configName] ? ' checked="checked"' : '') + '/>' + desc + '</label></div>';
    }
    function showConfig() {
        $("#aparat-config").parent().parent().removeClass("open");
        $("#content-section").empty();
        var fields = '<fieldset class="vertical"><legend>genel</legend>';
        fields += '<div><label for="EksiBetaTheme">tema:</label><select id="EksiBeta_theme">';
        for(var themeid in themes) {
            fields += '<option value="' + themeid + '"' + (betaConfig.theme == themeid ? ' selected="selected"' : '') + '>' + themes[themeid].name + '</option>';
        }
        fields += '</select></div>';
        fields += configCheckbox("fullWidth", "pencerenin tamamına genişlet, yanlarda boşluk kalmasın");
        fields += configCheckbox("transparentHeader", "üst çubuk şeffaf olsun");
        fields += '</fieldset>';
        fields += '<fieldset class="vertical"><legend>sol frame</legend>';
        fields += configCheckbox("denseTopics", "başlıklar arasındaki boşlukları azalt");
        fields += configCheckbox("topicActivityInBrackets", "bugün yazılan entry sayısını parantez içinde göster");
        fields += configCheckbox("ellipsisForToday", "bugün yazılan entry'lere üç noktalar ile ulaşayım, başlığın linki tüm entry'leri göstersin");
        fields += '</fieldset>';
        fields += '<fieldset class="vertical"><legend>başlık</legend>';
        fields += configCheckbox("removeAside", "konulu videolar kısmını kaldır");
        fields += configCheckbox("moveChannels", "başlık kanallarını başlık adının hemen altında göster");
        fields += configCheckbox("imageSearch", "başlık adı ile google görseller'de arama yap ve bulunan görseli kenarda göster (resözlük gibi)");
        fields += '</fieldset>';
        fields += '<fieldset class="vertical"><legend>entry\'ler</legend>';
        fields += configCheckbox("entryNumbersOnLeftSide", "entry numaralarını entry'lerin soluna çek");
        fields += configCheckbox("entryOptionsOnHover", "oylama, mesaj atma gibi düğmeleri sadece imleç entry\'nin üzerindeyken göster");
        fields += '</fieldset>';

        fields += '<div class="actions"><button id="aparat-save">kaydet</button></div>';
        var configDiv = $('<div id="topic"><h1 id="title" style="margin-bottom: 20px;">ekşi sözlük aparat ayarları</h1>' + fields + '</div>');
        $("#content-section").append(configDiv);
        $("#aparat-save").click(finishConfig);
        
    }
    
    function finishConfig() {
        for(var configName in betaConfig) {
            var configElem = $("#EksiBeta_" + configName);
            if (configElem.length !== 0) {
                if (configElem.is("input")) {
                    betaConfig[configName] = configElem.prop("checked");
                } else {
                    betaConfig[configName] = configElem.prop("value");
                }
            }
        }
        setTimeout(function() {
            saveConfig();
            location.reload();
        }, 0);
    }
    
    function loadConfig() {
        for(var configName in betaConfig) {
            var val = GM_getValue(configName, undefined);
            if (val != undefined) {
                betaConfig[configName] = val;
                console.log("load: " + configName + " " + val);
            }
        }
    }
    
    function saveConfig(){
        for(var configName in betaConfig) {
            GM_setValue(configName, betaConfig[configName]);
            console.log("save: " + configName + " " + betaConfig[configName]);
        }
    }
    
    function startRestyleTopics() {
        if (betaConfig.topicActivityInBrackets) {
            eksiAddStyle(".topic-list.partial small { color: #000; font-size: 0.9em } ");
        }
        if (betaConfig.ellipsisForToday) {
            eksiAddStyle(".topic-list.partial li > a.topictoday { visibility: hidden; margin-left: 4px } .topic-list.partial li:hover > a.topictoday { visibility: visible }");
        }
        if (betaConfig.ellipsisForToday || betaConfig.topicActivityInBrackets) {
            eksiAddStyle(" .topic-list.partial li > a { display: inline; padding-right: 0 !important }");
            if (betaConfig.denseTopics) {
                eksiAddStyle(".topic-list li { margin: 0px 0 2px 0; line-height: 17px; padding-top: 2px }");
            } else {
                eksiAddStyle(".topic-list li { margin: 5px 0; line-height: 19px; padding-top: 3px }");
            }
        } else if (betaConfig.denseTopics) {
            eksiAddStyle(".topic-list li { margin: 0; line-height: 14px }");
        }

    	var target = document.getElementById('partial-index');
    	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    	if (MutationObserver) {
    		var observer = new MutationObserver(function(mutations) {
    			mutations.forEach(function(mutation) {
    				restyleTopics();
    			});
    		});
    		var config = { attributes: false, childList: true, characterData: true }
    		observer.observe(target, config);
    	} else {
    		target.addEventListener("DOMNodeInserted", function(event) {
    			restyleTopics();
    		}, true);
    	}
        restyleTopics();
    }
    
    function registerConfig() {
        try {
            GM_registerMenuCommand("beta aparatı ayarları", showConfig);
        } catch(err) { }
    }

    function process() {
        selectTheme();
        removeAd();
        moveChannels();
        removeAside();
        titleImageSearch();
        startRestyleTopics();
        restyleContent();
        moveEntryNumbers();
        applyTheme();
        commitStyles();
        createSettingsMenuEntry();
    }
    
    function pageLoad() {
        $ = unsafeWindow.jQuery;
        setTimeout(function() {
            loadConfig();
            process();
        }, 0);
    }
    
    this.start = function() {
        if (navigator.appName == "Opera") {
        	pageLoad();
        } else {
        	window.addEventListener("DOMContentLoaded", function load(event) {
        		pageLoad();
        	});
        }    
    }
}

var eksibeta = new EksiBetaAparati();
eksibeta.start();
