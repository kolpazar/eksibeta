// ==UserScript==
// @name        eksi sozluk antika aparati
// @namespace   https://github.com/kolpazar
// @description yeni ek$i sozluk'u kismen antikalastirmaya yarar.
// @author      xanathar
// @include     http://eksisozluk.com/*
// @include     https://eksisozluk.com/*
// @run-at      document-start
// @grant       GM_getValue
// @grant       GM_setValue
// @updateUrl   https://github.com/kolpazar/eksibeta/raw/master/src/eksi_sozluk_antika.user.js
// @downloadUrl https://github.com/kolpazar/eksibeta/raw/master/src/eksi_sozluk_antika.user.js
// @version     1.0.1
// ==/UserScript==

function EksiBetaAparati() {

    var browser = "";
    var afterLoadDone = false;
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
        fullWidth: true,
        theme: "herzamanki_yeni"
    };
    
    var defaultTheme = "herzamanki_yeni";
    var themes = {
        "herzamanki_yeni": {
            name: "her zamanki (yeni)",
            backgroundColor: "#EBEBEB",
            text: "#000",
            gray: "#666",
            link: "#00338F",
            linkHover: "#00338F",
            linkHoverBack: "#D3E2CE",
            headerShadow: "#AAA",
            listShadow: "#DEDEDE",
            buttonBorder: "#2D4261",
            buttonBack: "#456695",
            buttonGradTo: "#3D5A84",
            buttonText: "#FFF"
        },
        "herzamanki_eski": {
            name: "antik zamanki (ssg & clairvoyant)",
            backgroundColor: "#CCC",
            text: "#000",
            gray: "#555",
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
            name: "her zamanki enhanced (rotten)",
            backgroundColor: "#CCC",
            background: '#CCC url("http://antik.eksisozluk.com/css/he_back.jpg") repeat-x fixed bottom',
            headerBackground: '#CCC url("http://antik.eksisozluk.com/css/he_top.jpg") repeat-x fixed top',
            logo: 'url("")',
            text: "#000",
            gray: "#555",
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
            name: "cok pis (carmilla)",
            backgroundColor: "#B1AC99",
            background: '#B1AC99 url("http://antik.eksisozluk.com/css/pis_bg.jpg") fixed',
            headerBackground: '#B1AC99 url("http://antik.eksisozluk.com/css/pis_top.jpg") repeat-x fixed top',
            logo: 'url("http://antik.eksisozluk.com/css/pis_logo.jpg")',
            text: "#36312E",
            gray: "#56514E",
            link: "#FFF",
            linkHover: "#FFF",
            linkHoverBack: "#BA7663",
            headerShadow: "#716863",
            listShadow: "#9F938B",
            titleBack: "#BA7663",
            buttonBorder: "#36312E",
            buttonBack: "#56514E",
            buttonGradTo: "#36312E",
            buttonText: "#FFF"
        },
        "obsessed_with_blue": {
            name: "obsessed with blue (clairvoyant)",
            backgroundColor: "#333A57",
            logo: 'url("http://antik.eksisozluk.com/css/cresslogo.gif")',
            text: "#FAF0E6",
            gray: "#90A4BE",
            link: "#B0C4DE",
            linkHover: "#FAF0E6",
            linkHoverBack: "#485070",
            headerShadow: "#222",
            listShadow: "#485070",
            buttonBorder: "#2D4261",
            buttonBack: "#4C5B73",
            buttonGradTo: "#3C4B60",
            buttonText: "#FFF"
        },
        "dietcoke": {
            name: "diet coke (clairvoyant)",
            backgroundColor: "#EAEAEA",
            text: "#000",
            gray: "#666",
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
        styles = "";
    }
    
    function removeAdBefore() {
        if (betaConfig.removeAd) {
            eksiAddStyle(".ad-banner728-top, #scriptId1 { display: none }");
        }
    }

    function removeAdAfter() {
        if (betaConfig.removeAd) {
            var adTheme = $("#adtheme");
            if (adTheme.length !== 0) {
                $.cookie("notheme", 1);
                adTheme.remove();
                $("#return-to-innocence").remove();
            }
            $(".ad-banner728-top").remove();
        }
    }
    
    function removeAsideBefore() {
        if (betaConfig.removeAside) {
            eksiAddStyle("#aside { display: none }");
        }
    }
    
    function removeAsideAfter() {
        if (betaConfig.removeAside) {
            $("#aside").remove();
        }
    }
    
    function titleImageSearch() {
        if (betaConfig.imageSearch) {
            var title = $("#title");
            if (title.length !== 0) {
                $.getJSON("https://ajax.googleapis.com/ajax/services/search/images?callback=?&v=1.0&rsz=1&q=" + title.text().trim(), function(data) {
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
                $("#topic-channel-info > #topic-channels > ul").css({'margin-bottom':'0'});
                $("#topic-channel-info > #topic-channels a").css({'font-size':'0.9em'});
                $("#topic-channel-suggestion-menu-toggle").css({'color':currentTheme.gray});
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
                topic.html(topic.html().trim());
                var topicLink = topic.children("a");

                /*
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
                */
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
        eksiAddStyle("#entry-list { margin-top: 0 }");
        if (betaConfig.expandContent) {
            eksiAddStyle("#content-section { width: auto; float: none } #index-section { width: 240px } #main { margin-left: 240px }");
            if (!betaConfig.removeAside) {
                eksiAddStyle("#content-section { margin-right: 320px } #aside { width: 300px; float: none; position: absolute; top: 0; right: 0 }");
            }
        }
        if (betaConfig.entryOptionsOnHover) {
            eksiAddStyle("#entry-list > li .feedback, #entry-list > li .options { visibility: hidden; } #entry-list > li:hover .feedback, #entry-list > li:hover .options { visibility: visible; }");
        }
        if (betaConfig.transparentHeader) {
            eksiAddStyle("body > header { background-color: " + currentTheme.backgroundColor + " } #sub-navigation { background-color: transparent }");
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
            eksiAddStyle("#entry-list > li:before { color: " + currentTheme.text + "; font-size: 1em; border-width: 0px; top: 0; position: absolute; left: -52pt; text-align: right; width: 45pt; content: attr(value) \".\"; }");
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
        eksiAddStyle("body, #top-bar > #advanced-search-form, .ui-autocomplete, .dropdown .dropdown-menu, .share-dialog, #in-topic-search-options, #topic-channel-info #topic-channel-suggestion-menu { background: " + currentTheme.backgroundColor + "; border-color: " + currentTheme.gray + "; color: " + currentTheme.text + " }");
        if (currentTheme.background) {
            eksiAddStyle("body { background: " + currentTheme.background + " }");
        }
        if (betaConfig.transparentHeader) {
            eksiAddStyle("#a3-toggle:after, #top-bar .dropdown-toggle:after { border-top-color: " + currentTheme.gray + " }");
            if (currentTheme.headerBackground) {
                eksiAddStyle("html.no-touch > body > header { background: " + currentTheme.headerBackground + " }");
            }
            if (currentTheme.logo) {
                eksiAddStyle("#logo a { background-image: " + currentTheme.logo + " }");
            }
        }
        if (currentTheme.titleBack) {
            eksiAddStyle("#title { background: " + currentTheme.titleBack + " }");
        }
        eksiAddStyle("h1, h2, h3, h4, h5, h6, fieldset legend { color: " + currentTheme.text + " }");
        eksiAddStyle("a { color: " + currentTheme.link + " } html.no-touch .pager > a:hover, html.no-touch .topic-list li > a:hover, html.no-touch #feed-refresh-link:hover, html.no-touch .dropdown .dropdown-menu li > a:hover  { color: " + currentTheme.linkHover + "; background-color: " + currentTheme.linkHoverBack + "}");
        eksiAddStyle(".pager > a, #feed-refresh-link, .topic-list li, #entry-list > li:before, fieldset legend, .dropdown .dropdown-menu li.seperated { border-color: " + currentTheme.listShadow + " }");
        eksiAddStyle("button.primary, input[type=\"submit\"].primary, input[type=\"button\"].primary { background-color: " + currentTheme.buttonBack + "; background-image: -moz-linear-gradient(top, " + currentTheme.buttonBack + ", " + currentTheme.buttonGradTo + "); background-image: -webkit-linear-gradient(top, " + currentTheme.buttonBack + ", " + currentTheme.buttonGradTo + "); border-color: " + currentTheme.buttonBorder + "; color: " + currentTheme.buttonText + " }");
        eksiAddStyle("#entry-list footer div.feedback > a, #entry-list footer div.options > a, #entry-list footer div.other > a, #entry-list footer .rate-options a, #entry-list footer .vote-response-area, .sub-title-menu > a, .sub-title-menu > div > a, .sub-title-menu > div > .dropdown > a, h1 small, h2 small, h3 small, h4 small, h5 small, h6 small, small, time, .muted {color: " + currentTheme.gray + " }");
        eksiAddStyle(".sub-title-menu #topic-share-menu > .toggles:after, .sub-title-menu #topic-research-menu .toggles:after, .sub-title-menu #in-topic-search-menu > .toggles:after, #entry-list footer div.other > a:after, #entry-list footer .share-link:after { border-top-color: " + currentTheme.gray + " }");
        if (currentTheme.headerShadow) {
            eksiAddStyle("header { box-shadow: 0 1px 2px 1px " + currentTheme.headerShadow + "; }");
        }
    }
    
    function createSettingsMenuEntry() {
        var showConf = $('<li><a id="aparat-config" href="#">antika</a></li>');
        if ($("#top-navigation").hasClass("loggedin")) {
            $("#top-navigation ul li ul li.seperated").before(showConf);  
        } else {
            $("#top-navigation ul").append(showConf);
        }
        $("#aparat-config").click(function() {
            showConfig();
            if (browser == "m") {
                $("#aparat-config").parent().parent().removeClass("open");
            }
        });
    }
    
    function configCheckbox(configName, desc) {
        return '<div><label class="checkbox"><input type="checkbox" id="EksiBeta_' + configName + '"' + (betaConfig[configName] ? ' checked="checked"' : '') + '/>' + desc + '</label></div>';
    }
    function showConfig() {
        $("#content-section").empty();
        var fields = '<fieldset class="vertical"><legend>genel</legend>';
        fields += '<div><label for="EksiBetaTheme">tema</label><select id="EksiBeta_theme">';
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

        fields += '<div class="actions"><button class="primary" id="aparat-save">kaydet</button></div>';
        var configDiv = $('<div id="topic"><h1 id="title" style="margin-bottom: 20px;">ekşi sözlük antika aparatı ayarları</h1>' + fields + '</div>');
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
            var val = null;
            if (browser == "c") {
                val = localStorage.getItem("antikaci-" + configName);
                if ((val == "true") || (val == "false")) {
                    val = (val == "true");
                }
            } else {
                val = GM_getValue(configName, null);
            }
            if (val != null) {
                betaConfig[configName] = val;
                //console.log("load: " + configName + " " + val);
            }
        }
    }
    
    function saveConfig(){
        for(var configName in betaConfig) {
            if (browser == "c") {
                localStorage.setItem("antikaci-" + configName, betaConfig[configName]);
            } else {
                GM_setValue(configName, betaConfig[configName]);
            }
            //console.log("save: " + configName + " " + betaConfig[configName]);
        }
    }
    
    function restyleTopicsBefore() {
        if (betaConfig.topicActivityInBrackets) {
            eksiAddStyle(".topic-list.partial li.numbered > a > small { color: " + currentTheme.text + "; font-size: 0.9em; position: static } #partial-index .topic-list li small::before { content: '(' } #partial-index .topic-list li small::after { content: ')' } ");
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
    }
    
    function restyleTopicsAfter() {
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
    
    function pageBeforeLoad() {
        loadConfig();
        selectTheme();
        removeAdBefore();
        removeAsideBefore();
        restyleTopicsBefore();
        restyleContent();
        moveEntryNumbers();
        applyTheme();
        commitStyles();
    }
    
    function pageAfterLoad() {
        if (afterLoadDone) {
            return;
        }
        afterLoadDone = true;
        if (typeof $ === "undefined") {
            $ = window.jQuery || unsafeWindow.jQuery;
        }
        restyleTopicsAfter();
        removeAdAfter();
        moveChannels();
        removeAsideAfter();
        titleImageSearch();
        createSettingsMenuEntry();
    }
    
    this.start = function() {
        if (navigator.userAgent.indexOf("Gecko/") >= 0) {
            browser = "m";
        } else if (navigator.userAgent.indexOf("AppleWebKit/") >= 0) {
            browser = "c";
        } else if (navigator.appName == "Opera") {
            browser = "o";
        }
        
        pageBeforeLoad();
        if (browser == "m") {
            window.addEventListener("DOMContentLoaded", function load(event) {
                pageAfterLoad();
            }, false);
        } else if (browser == "c") {
            document.onreadystatechange = function () {
                if ((document.readyState == "interactive") || ((document.readyState == "complete") && !afterLoadDone)) {
                    pageAfterLoad();
                }
            }
        } else {
            pageAfterLoad();
        }
    }
}

var eksibeta = new EksiBetaAparati();
eksibeta.start();
