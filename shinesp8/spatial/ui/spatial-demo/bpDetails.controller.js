sap.ui.controller("spatial-demo.bpDetails", {

    // instantiated view will be added to the oViewCache object and retrieved from there
    oViewCache: {},

    onInit: function() {

    },

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf shine_so.main
     */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf shine_so.main
     */
    onAfterRendering: function() {
        var view = this.getView();

        // Get the DOM node to which we will append the map
        var mapContainer = document.getElementById("__splitter0_firstPane");

        // We create a new instance of InfoBubbles bound to a variable so we can call it later on
        var infoBubbles = new nokia.maps.map.component.InfoBubbles();

        // Create a map inside the map container DOM node
        var map = new nokia.maps.map.Display(mapContainer, {
            // initial center and zoom level of the map
            center: [52.51, 13.4],
            zoomLevel: 5,
            components: [
                //ZoomBar provides a UI to zoom the map in & out
                new nokia.maps.map.component.ZoomBar(),
                // We add the behavior component to allow panning / zooming of the map
                new nokia.maps.map.component.Behavior(),
                // Creates UI to easily switch between street map satellite and terrain mapview modes
                new nokia.maps.map.component.TypeSelector(),
                /* Shows a scale bar in the bottom right corner of the map depicting
                 * ratio of a distance on the map to the corresponding distance in the real world
                 * in either kilometers or miles
                 */
                new nokia.maps.map.component.ScaleBar(),
                infoBubbles
            ]
        });

        var addresses = [],
            labels = [],
            bps = [];

        $.ajax({
            type: "GET",
            async: false,
            url: "../services/getAllBusinessPartnersData.xsjs",
            success: function(data) {
                bps = data.entry;
                for (var i = 0; i < data.entry.length; i++) {
                    labels[i] = data.entry[i].Name;
                    addresses[i] = data.entry[i].Building + ' ' + data.entry[i].Street + ', ' + data.entry[i].Zip + ' ' + data.entry[i].City + ', ' + data.entry[i].Country;
                }
            },
            error: function(err) {
                alert(err.toString());
            }
        });

        // We will put our address markers into this container zo we can zoom in to the markers
        var addressesContainer = new nokia.maps.map.Container(),
            marker,
            searchCenter = new nokia.maps.geo.Coordinate(52.51, 13.4),
            i = 0,
            len = addresses.length,
            requests = addresses.length;

        //map.objects.add(addressesContainer);

        /*
         * Function to be called on marker click.
         */
        function onMarkerSelected(label, selectedBP, marker) {
            infoBubbles.openBubble(label, marker.coordinate);

            view.bpHeader.setTitle(selectedBP.Name);
            view.bpId.setText(selectedBP.ID);
            view.bpEmail.setText(selectedBP.Email);
            view.bpPhone.setText(selectedBP.Phone);
            //			view.oBPEmailLabel.setHref("mailto:" + selectedBP.Email);
            view.bpWeb.setText(selectedBP.Web);
            //			view.oBPWebLabel.setHref(selectedBP.Web);

            view.bpBuildingItem.setValue(selectedBP.Building);
            view.bpStreetItem.setValue(selectedBP.Street);
            view.bpCityItem.setValue(selectedBP.City);
            view.bpCountryItem.setValue(selectedBP.Country);
            view.bpZipItem.setValue(selectedBP.Zip);

            // send event for bp transaction details display
            $.ajax({
                type: "GET",
                async: false,
                url: "../services/getBPTransactionData.xsjs?cmd=getData&bpId=" + selectedBP.ID,
                success: function(data) {
                    var sales, purchase;
                    var oModel = new sap.ui.model.json.JSONModel({});
                    if (!data.salesTotal) {
                        sales = 0;
                    } else {
                        sales = data.salesTotal;
                        // add sales chart
                        oModel.setData(data);
                    }

                    view.oSalesChart.setModel(oModel);
                    view.oSalesChart.bindRows("/salesYoY");
                    oModel.refresh();

                    view.bpHeader.setNumber(sales);
                    view.bpHeader.setNumberUnit(data.currency);
                },
                error: function(err) {
                    alert(err.toString());
                }
            });
        }

        /*
         * Custom theme for clustering
         */
        function CustomTheme() {

            var baseTheme = new nokia.maps.clustering.MarkerTheme();
            this.getClusterPresentation = function(dataPoints) {
                var cluster = baseTheme.getClusterPresentation(dataPoints);
                cluster.$boundingBox = dataPoints.getBounds();
                return cluster;
            }
            // Add a Standard Marker for Noise Points.
            this.getNoisePresentation = function(dataPoint) {
                var marker = new nokia.maps.map.StandardMarker([dataPoint.latitude, dataPoint.longitude]);
                /* We store the address from the location and name of the
                 * Place object in the marker so we can show the
                 * information on click.
                 */
                marker.$address = dataPoint.$address;
                marker.$label = dataPoint.$label;
                marker.bp = dataPoint.bp;

                marker.addListener("click", function() {
                    onMarkerSelected(this.$label, this.bp, this);
                });

                return marker;
            }
        }

        /* Create an instance of ClusterProvider. It uses the default display theme (an
         * instance of nokia.maps.clustering.MarkerTheme).
         *
         * The code sets
         *	- eps: the epsilon distance (the radius within which data points are
         *		considered for clustering)
         *- minPts: the smallest number of points can exist within
         *		the epsilon distance that can exist as individual noise points (not
         *	clustered),
         *- dataPoints: representing the data points to use for cluster creation.
         *Here it is an empty array since the actual data points are provided dynamically.
         */
        var ClusterProvider = nokia.maps.clustering.ClusterProvider,
            clusterProvider = new ClusterProvider(map, {
                theme: new CustomTheme(),
                eps: 18,
                minPts: 1,
                dataPoints: []
            });

        /* Once the map is initialized and ready (an event that is fired only once),
         * trigger the display.
         */
        map.addListener("displayready", function() {
            for (var z = 0; z < bps.length; z++) {

                // Create a new marker on the found location
                marker = new nokia.maps.map.StandardMarker(
                    new nokia.maps.geo.Coordinate(parseFloat(bps[z].lat),
                        parseFloat(bps[z].long)));
                // Add marker to its container so it will be render
                addressesContainer.objects.add(marker);
                var cood = new nokia.maps.geo.Coordinate(parseFloat(bps[z].lat),
                    parseFloat(bps[z].long));

                /* We store the address from the location and name of the
                 * Place object in the dataPoint so we can pass the
                 * information to the marker in cluster theme.
                 */
                cood.$address = addresses[z];
                cood.$label = bps[z].Name;
                cood.bp = bps[z];
                clusterProvider.add(cood);
            }

            clusterProvider.cluster();

            // show the map and ask user to select a BP
            map.zoomTo(addressesContainer.getBoundingBox());
            jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.alert(sap.app.i18n.getText("SELECT_BP"),
                sap.ui.commons.MessageBox.Icon.INFORMATION,
                sap.app.i18n.getText("TITLE"));
        });

        /* We would like to add event listener on mouse click or finger tap so we check
         * nokia.maps.dom.Page.browser.touch which indicates whether the used browser has a touch interface.
         */
        var TOUCH = nokia.maps.dom.Page.browser.touch,
            CLICK = TOUCH ? "tap" : "click";

        /* Instead of adding an event listener to every marker we are going 
         * to use event delegation. We install one event handler on the
         * container that contains all of the markers.
         */
        clusterProvider.addListener(CLICK, function(evt) {


        });
    },

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf shine_so.main
     */
    //	onExit: function() {
    //
    //	}

});