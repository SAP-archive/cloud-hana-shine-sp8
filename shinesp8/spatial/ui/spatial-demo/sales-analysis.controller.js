 sap.ui.controller("spatial-demo.sales-analysis", {

     onInit: function() {
         var controller = this;
         controller.isPolygonDisplayed = false;
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
         var oController = this;
         var view = this.getView();

         // Get the DOM node to which we will append the map
         var mapContainer = document.getElementById("__splitter1_firstPane");

         // We create a new instance of InfoBubbles bound to a variable so we can call it later on
         var infoBubbles = new nokia.maps.map.component.InfoBubbles();

         // Create a map inside the map container DOM node
         oController.map = new nokia.maps.map.Display(mapContainer, {
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

         var oDialog1 = new sap.ui.commons.Dialog();
         oDialog1.setTitle(sap.app.i18n.getText("TITLE"));
         var oText = new sap.ui.core.HTML({
             content: sap.app.i18n.getText("INIT_HELP")
         });
         oDialog1.addContent(oText);
         oDialog1.addButton(new sap.ui.commons.Button({
             text: sap.app.i18n.getText("OK"),
             press: function() {
                 oDialog1.close();
             }
         }));
         oDialog1.open();

         oController.bpMarkers = new nokia.maps.map.Container();

         oController.map.addListener("mapviewchangeend", function(event) {

             // exclude invalid request
             // exclude if user has drawn a polygon
             if (oController.map.getViewBounds().topLeft.latitude == oController.map.getViewBounds().bottomRight.latitude || oController.isPolygonDisplayed) {
                 return;
             }

             // make request for sales analysis for this area
             oController.getSalesAnalysisForArea(oController, view);
         });

         var markers = [];

         // Javascript inheritance helper function
         function extend(B, A) {
             function I() {}
             I.prototype = A.prototype;
             B.prototype = new I();
             B.prototype.constructor = B;
         }

         /* We create a new helper object MarkerPolyline which 
          * create polylines with standard Markers on every
          * point in its path
          */
         var MarkerPolyline = function(coords, props) {
             // Call the "super" constructor to initialize properties inherited from Container
             nokia.maps.map.Container.call(this);

             // Calling MarkerPolyline constructor
             this.init(coords, props);
         };

         extend(MarkerPolyline, nokia.maps.map.Container);

         // MarkerPolyline constructor function 
         MarkerPolyline.prototype.init = function(coords, props) {
             var i,
                 coord,
                 marker,
                 lineProps = props.polyline || {},
                 markerProps = (this.markerProps = props.marker || {});

             this.coords = {};

             // Create a polyline
             this.polyline = new nokia.maps.map.Polyline(coords, lineProps);

             // Add the polyline to the container
             this.objects.add(this.polyline);

             /* We loop through the point to create markers 
              * for each of the points and we store them
              */
             for (i = 0; coord = coords[i]; i++) {
                 marker = new nokia.maps.map.StandardMarker(coord, markerProps);
                 this.coords[coord.latitude + "_" + coord.longitude] = {
                     idx: i + 1,
                     marker: marker
                 };
                 this.objects.add(marker);
                 markers.push(marker);
             }
         };

         // The add function allows you to add a new point to a MarkerPolyline
         MarkerPolyline.prototype.add = function(coord) {
             // Create a new standard marker
             var markerProps = this.markerProps,
                 marker,
                 key = coord.latitude + "_" + coord.longitude;

             if (!this.coords[key]) {
                 marker = new nokia.maps.map.StandardMarker(coord, markerProps);
                 this.coords[key] = {
                     idx: this.objects.getLength(),
                     marker: marker
                 };

                 // add it to local collection
                 markers.push(marker);

                 /* Add the marker to the object's collections 
                  * so the marker will be rendered onto the map
                  */
                 this.objects.add(marker);

                 /* We can extend a nokia.maps.map.Polyline by adding
                  * geo coordinates to its internal nokia.maps.map.Shape
                  * accessable via the path property
                  */
                 this.polyline.path.add(coord);
             }
         };

         // The remove function allows you to remove a point from MarkerPolyline
         MarkerPolyline.prototype.remove = function(coord) {
             /* Polyline internaly stores the geo coordinates that make up
              * its shape as a nokia.maps.util.Strip.
              *
              * Strip stores coordinates in the following format
              * [latitude, longitude, altitude, ..., latitude, longitude, altitude]
              */
             var coords = this.polyline.path.internalArray,
                 i = this.polyline.path.getLength(),
                 marker,
                 key = coord.latitude + "_" + coord.longitude,
                 idx;

             if (!this.coords[key])
                 return;

             /* To remove from a Strip you need to know the index
              * of the coordinate to remove e.g. its latitude
              * hence we loop over the internalArray as described above
              */
             while (i--) {
                 if (coords[i * 3] === coord.latitude && coords[i * 3 + 1] === coord.longitude) {
                     idx = i;
                 }
             }

             // Index of coordinate found, now we remove coordinate from polyline
             this.polyline.path.remove(idx);

             // Remove the marker
             marker = this.coords[key].marker;
             this.objects.remove(marker);
             marker.destroy();

             delete this.coords[key];
         };

         // Set of initial geo coordinates to create the polyline
         var coords = [];

         // Create a new polyline with markers
         var markerPolyline = new MarkerPolyline(
             coords, {
                 polyline: {
                     pen: {
                         strokeColor: "#00F8",
                         lineWidth: 4
                     }
                 },
                 marker: {
                     brush: {
                         color: "#1080dd"
                     }
                 }
             }
         );

         /* We would like to add event listener on mouse click or finger tap so we check
          * nokia.maps.dom.Page.browser.touch which indicates whether the used browser has a touch interface.
          */
         var TOUCH = nokia.maps.dom.Page.browser.touch,
             CLICK = TOUCH ? "tap" : "click",
             addedCoords = [],
             oSalesChart;

         // add event listeners for bpmarkers
         oController.bpMarkers.addListener(CLICK, function(evt) {
             var marker = evt.target;

             if (marker instanceof nokia.maps.map.Marker) {

                 if (oSalesChart) {
                     oSalesChart.destroy();
                 }

                 oSalesChart = new sap.makit.Chart({
                     type: sap.makit.ChartType.Column,
                     width: "300px",
                     height: "175px",
                     showRangeSelector: false,
                     showTableValue: true,
                     category: new sap.makit.Category({
                         column: "YEAR",
                         displayName: sap.app.i18n.getText("YEAR")
                     }),
                     values: [new sap.makit.Value({
                         expression: "AMOUNT",
                         format: "rounded2",
                         displayName: sap.app.i18n.getText("AMOUNT")
                     })],
                 });

                 oSalesChart.addColumn(new sap.makit.Column({
                     name: "YEAR",
                     value: "{year}"
                 }));
                 oSalesChart.addColumn(new sap.makit.Column({
                     name: "AMOUNT",
                     value: "{amount}"
                 }));

                 // Set the tail of the bubble to the coordinate of the marker
                 infoBubbles.openBubble(
                     '<div>' +
                     '<h2>' + marker.data.companyName + ' ' + marker.data.legalForm + '</h2>' +
                     '<div id=\'chartHolder\'></div></div>',
                     marker.coordinate);

                 // cancel events
                 evt.cancel();

                 // send event for bp transaction details display
                 $.ajax({
                     type: "GET",
                     async: true,
                     url: "../services/getBPTransactionData.xsjs?cmd=getData&bpId=" + marker.data.partnerID,
                     success: function(data) {
                         var oModel = new sap.ui.model.json.JSONModel({});
                         oModel.setData(data);

                         oSalesChart.setModel(oModel);
                         oSalesChart.bindRows("/salesYoY");

                         // remove old chart
                         $("#chartHolder").html("");

                         oSalesChart.placeAt('chartHolder');
                     },
                     error: function(err) {
                                        }
                 });

             }

         });

         // Attach an event listeners on mouse click / touch to add points to
         oController.map.addListener(CLICK, function(evt) {
             // We translate a screen pixel into geo coordinate (latitude, longitude) 
             var coord = oController.map.pixelToGeo(evt.displayX, evt.displayY);

             // Next we add the geoCoordinate to the markerPolyline
             markerPolyline.add(coord);

             // We store added coordinates so we can remove them later on
             addedCoords.push(coord);

             if (addedCoords.length == 1) {

                 // get marker from the collection
                 var marker = markers[0];

                 // add single marker
                 oController.map.objects.add(marker);

                 // add event listener to marker
                 marker.addListener(CLICK, function(evt) {

                     //remove polygon instance from map
                     oController.map.objects.remove(oController.polygon);

                     jQuery.sap.require("sap.ui.commons.MessageBox");
                     sap.ui.commons.MessageBox.alert(sap.app.i18n.getText("PLEASE_WAIT"),
                         sap.ui.commons.MessageBox.Icon.INFORMATION,
                         sap.app.i18n.getText("TITLE"));

                     // remove customer markers from the map
                     if (oController.bpMarkers && oController.bpMarkers.objects) {
                         oController.bpMarkers.objects.clear();
                     }

                     //add new polygon
                     oController.polygon = new nokia.maps.map.Polygon(
                         addedCoords, {
                             pen: {
                                 strokeColor: "#0099",
                                 lineWidth: 1
                             },
                             brush: {
                                 color: "#0099cc99"
                             }
                         }
                     );

                     oController.map.objects.add(oController.polygon);

                     //set polygon is displayed
                     oController.isPolygonDisplayed = true;

                     // construct payload
                     var payload = {};
                     payload.points = [];
                     for (var k = 0; k < addedCoords.length; k++) {
                         var entry = {};
                         entry.lat = addedCoords[k].latitude;
                         entry.long = addedCoords[k].longitude;
                         payload.points.push(entry);
                     }
                     payload.points.push({
                         lat: addedCoords[0].latitude,
                         long: addedCoords[0].longitude
                     });

                     // clear polyline
                     markerPolyline.objects.clear();

                     // remove polyline from map
                     oController.map.objects.remove(markerPolyline);

                     // reset polyline
                     markerPolyline = new MarkerPolyline(
                         coords, {
                             polyline: {
                                 pen: {
                                     strokeColor: "#00F8",
                                     lineWidth: 4
                                 }
                             },
                             marker: {
                                 brush: {
                                     color: "#1080dd"
                                 }
                             }
                         }
                     );

                     // get first marker from the collection
                     var marker = markers[0];

                     // remove first marker
                     oController.map.objects.remove(marker);

                     addedCoords = [];
                     markers = [];

                     // handle xsrf token
                     // first obtain token using Fetch
                     var xsrf_token;
                     $.ajax({
                         type: "GET",
                         async: false,
                         url: "../../services/soCreate.xsodata",
                         contentType: "application/json",
                         headers: {
                             'x-csrf-token': 'Fetch'
                         },
                         success: function(data, textStatus, request) {
                             xsrf_token = request.getResponseHeader('x-csrf-token');
                         }
                     });

                     // add x-csrf-token in headers
                     // make the request to get the information
                     $.ajax({
                         type: "POST",
                         data: JSON.stringify(payload),
                         headers: {
                             'x-csrf-token': xsrf_token
                         },
                         async: true,
                         url: "../services/getSalesAnalysis.xsjs",
                         success: function(data) {
                             oController.addDataToMap(data, view, oController);
                         },
                         error: function(err) {}
                     });

                     // cancel this event
                     evt.cancel();
                 });

             } else if (addedCoords.length == 2) {

                 /* Add the markerPolyline to the map's object collection so 
                  * all of its containing shapes  will be rendered onto the map.
                  */
                 oController.map.objects.add(markerPolyline);
             }
         });

         oController.map.objects.add(oController.bpMarkers);
     },

     /** function to remove polygon **/
     removePolygon: function(oController) {

         if (oController.isPolygonDisplayed) {

             // remove polygon instance from map
             if (oController.map) {
                 oController.map.objects.remove(oController.polygon);
             }

             // remove customer markers from the map
             if (oController.bpMarkers && oController.bpMarkers.objects) {
                 oController.bpMarkers.objects.clear();
             }

             // reset flag
             oController.isPolygonDisplayed = false;

             // make request for sales analysis for this area
             oController.getSalesAnalysisForArea(oController, oController.getView());
         }
     },


     /**
      * Add data to the map.
      * Mark customers and fill up the sales data.
      */
     addDataToMap: function(data, view, oController) {
         // remove customer markers from the map
         if (oController.bpMarkers && oController.bpMarkers.objects) {
             oController.bpMarkers.objects.clear();
         }

         view.bpHeader.setNumber(data.totalSales);

         var oModel = new sap.ui.model.json.JSONModel({});
         oModel.setData(data);

         view.oSalesChart.setModel(oModel);
         if (data && data.salesYoY.length > 0) {
             view.oSalesChart.bindRows("/salesYoY");
         } else {
             view.oSalesChart.unbindRows();
             view.oSalesChart.rerender();
         }

         // add details for top customers
         for (var j = 0; j < data.topBuyers.length; j++) {
             view.oCustomerItems[j].setTitle(data.topBuyers[j].companyName + ' ' + data.topBuyers[j].legalForm);
             view.oCustomerItems[j].setNumber(data.topBuyers[j].totalSales);
             view.oCustomerItems[j].setNumberUnit("EUR");
             view.oCustomerItems[j].attr.setText(data.topBuyers[j].partnerID);

             // plot this customer on the map
             // Create a new marker on the location
             var custMarker = new nokia.maps.map.StandardMarker(
                 new nokia.maps.geo.Coordinate(parseFloat(data.topBuyers[j].lat),
                     parseFloat(data.topBuyers[j].long)), {
                     /* - brush: The color to draw interior of the shape.
                      *	It can be either an instance of nokia.maps.map.Brush or an object literal.
                      */
                     brush: {
                         // fillcolor of brush
                         color: "#F80"
                     }
                 });

             // Add marker to its container so it will be render
             oController.bpMarkers.objects.add(custMarker);

             /* We store the partnerID of the customer
              * Place object in the marker so we can create an infoBubble
              * with this information on click.
              */
             custMarker.data = data.topBuyers[j];
         }

         // reset texts in empty items
         for (; j < 5; j++) {
             view.oCustomerItems[j].setTitle("");
             view.oCustomerItems[j].setNumber("");
             view.oCustomerItems[j].setNumberUnit("");
             view.oCustomerItems[j].attr.setText("");
         }
     },

     /**
      * make sales analysis request for area
      */
     getSalesAnalysisForArea: function(oController, view) {

         // construct payload
         var payload = {};
         payload.points = [];
         // top left
         payload.points.push({
             lat: oController.map.getViewBounds().topLeft.latitude,
             long: oController.map.getViewBounds().topLeft.longitude
         });
         // top right
         payload.points.push({
             lat: oController.map.getViewBounds().topLeft.latitude,
             long: oController.map.getViewBounds().bottomRight.longitude
         });
         // bottom right
         payload.points.push({
             lat: oController.map.getViewBounds().bottomRight.latitude,
             long: oController.map.getViewBounds().bottomRight.longitude
         });
         // bottom left
         payload.points.push({
             lat: oController.map.getViewBounds().bottomRight.latitude,
             long: oController.map.getViewBounds().topLeft.longitude
         });
         // top left
         payload.points.push({
             lat: oController.map.getViewBounds().topLeft.latitude,
             long: oController.map.getViewBounds().topLeft.longitude
         });

         // handle xsrf token
         // first obtain token using Fetch
         var xsrf_token;
         $.ajax({
             type: "GET",
             async: false, // request has to synchronous
             url: "../../services/soCreate.xsodata",
             contentType: "application/json",
             headers: {
                 'x-csrf-token': 'Fetch'
             },
             success: function(data, textStatus, request) {
                 xsrf_token = request.getResponseHeader('x-csrf-token');
             }
         });

         // add x-csrf-token in headers

         // make the request to get the information
         $.ajax({
             type: "POST",
             data: JSON.stringify(payload),
             headers: {
                 'x-csrf-token': xsrf_token
             }, // add header to send x-csrf-token with this request
             async: true,
             url: "../services/getSalesAnalysis.xsjs",
             success: function(data) {
                 oController.addDataToMap(data, view, oController);
             },
             error: function(err) {

             }
         });
     },

 });