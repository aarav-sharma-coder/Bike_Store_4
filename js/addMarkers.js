AFRAME.registerComponent("create-markers", {
  
    init: async function() {
  
      var mainScene = document.querySelector("#main-scene");
  
      //get the dishes collection from firestore database
      var bikes = await this.getBikes();
     
      bikes.map(bike => {
        var marker = document.createElement("a-marker");   
        marker.setAttribute("id", bike.id);
        marker.setAttribute("type", "pattern");
        marker.setAttribute("url", bike.marker_pattern_url);
        marker.setAttribute("cursor", {
          rayOrigin: "mouse"
        });
  
        //set the markerhandler component
        marker.setAttribute("markerhandler", {});
        mainScene.appendChild(marker);
        
        var todaysDate = new Date();
        var todaysDay = todaysDate.getDay();

        var days=["sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"];
        // Adding 3D model to scene
        var model = document.createElement("a-entity");    
       if(bike.unavailable_days.includes(days[todaysDay])){
        model.setAttribute("id", `model-${bike.id}`);
        model.setAttribute("position", bike.model_geometry.position);
        model.setAttribute("rotation", bike.model_geometry.rotation);
        model.setAttribute("scale", bike.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${bike.model_url})`);
        model.setAttribute("gesture-handler", {});
        marker.appendChild(model);
  
        // Ingredients Container
        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${bike.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 1.7);
        mainPlane.setAttribute("height", 1.5);
        marker.appendChild(mainPlane);
  
        // Dish title background plane
        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${bike.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 1.69);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("material", { color: "#F0C30F" });
        mainPlane.appendChild(titlePlane);
  
        // Dish title
        var dishTitle = document.createElement("a-entity");
        dishTitle.setAttribute("id", `bike-title-${bike.id}`);
        dishTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        dishTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        dishTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: bike.bike_name.toUpperCase()
        });
        titlePlane.appendChild(dishTitle);
  
        // Ingredients List
        var ingredients = document.createElement("a-entity");
        ingredients.setAttribute("id", `features-${bike.id}`);
        ingredients.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
        ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        ingredients.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          align: "left",
          value: `${bike.features.join("\n\n")}`
        });
      
        mainPlane.appendChild(ingredients);
        var pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id", `price-plane-${bike.id}`);
        pricePlane.setAttribute(
          "src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
        pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        pricePlane.setAttribute("visible", false);

        //Price of the dish
        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${bike.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${bike.price}`
        });

      
        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);
      }
    });
  },
    //function to get the dishes collection from firestore database
    getBikes: async function(){
        return await firebase.
                     firestore()
                     .collection('bikes')
                     .get()
                     .then(snap=>{
                         return snap.docs.map(doc=>doc.data());
                     })
    }
  });