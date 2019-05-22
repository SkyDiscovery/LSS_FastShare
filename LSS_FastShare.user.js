// ==UserScript==
// @name         LSS_FastShare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Teile den Einsatz mit deinem Verband, ohne ihn extra öffnen zu müssen!
// @author       itsDreyter
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    show_share_btn();

    // extend missionsMarkerAdd
    var original_func = missionMarkerAdd;

    missionMarkerAdd = function(e)
    {
        original_func.apply(this, arguments);
        show_share_btn(e);
    }

    // show share buttons
    function show_share_btn(e)
    {
        // get missions
        var Missions = $('#mission_list .missionSideBarEntry');

        for(var i = 0; i < Missions.length; i++)
        {
            // build id for check
            var id = 'fastShare_' + Missions[i].getAttribute('mission_id');

            // check if we already added it ...
            if(Missions[i].firstElementChild.firstElementChild.children[0].id == id)
            {
                var match = Missions[i].firstElementChild.className.match('panel-success');

                if (match != undefined) remove_html_element(Missions[i]);

                continue;
            }
            else
            {
                if (Missions[i].firstElementChild.className.match('panel-success') != undefined) continue;
            }

            var html_elem = create_html_element(Missions[i].getAttribute('mission_id'));
            Missions[i].firstElementChild.firstElementChild.insertBefore(html_elem, Missions[i].firstElementChild.firstElementChild.children[0]);

            // add click event
            var click_id = "#fastShare_" + Missions[i].getAttribute('mission_id');
            $(document).on("click", click_id, function(){
                var mission_id = arguments[0].currentTarget.getAttribute("fastShare_mission_id");

                if(mission_id == undefined) return;

                $.ajax({
                    url: '/missions/' + mission_id + '/alliance'
                });

            });
        }
    }

    // removes specific html element
    function remove_html_element(mission)
    {
        mission.firstElementChild.firstElementChild.children[0].remove();
    }

    // create button for sharing...
    function create_html_element(mission_id)
    {
        // build link
        var href = '/missions/' + mission_id + '/alliance';

        // build id
        var id = 'fastShare_' + mission_id;

        // create <a> element
        var a = document.createElement('a');
        a.setAttribute("href", "#");
        a.setAttribute("class", "btn btn-success btn-xs");
        a.setAttribute("id", id);
        a.setAttribute("height", "15px");
        a.setAttribute("width", "15px");
        a.setAttribute("fastShare_mission_id", mission_id);

        // create img element
        var img = document.createElement('img');
        img.setAttribute("src", "/images/icons8-share.svg");
        img.setAttribute("class", "icon icons8-Share");
        img.setAttribute("width", "15px");
        img.setAttribute("height", "15px");

        a.appendChild(img);
        return a;
    }

})();